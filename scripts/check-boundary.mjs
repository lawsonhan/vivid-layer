import { createHash } from "node:crypto"
import { lstat, readFile, readdir } from "node:fs/promises"
import path from "node:path"

const repositoryRoot = path.resolve(import.meta.dirname, "..")
const registry = JSON.parse(
  await readFile(path.join(repositoryRoot, "registry.json"), "utf8")
)
const allowedRootEntries = new Set([
  ".git",
  ".github",
  ".gitignore",
  "ASSET_PROVENANCE.md",
  "CONTRIBUTING.md",
  "LICENSE",
  "NOTICE",
  "README.md",
  "THIRD_PARTY_NOTICES.md",
  "components",
  "hooks",
  "lib",
  "node_modules",
  "package.json",
  "pnpm-lock.yaml",
  "public",
  "registry",
  "registry.json",
  "scripts",
])
const allowedRegistrySourceRoots = [
  "components/effects/",
  "components/ui/",
  "hooks/",
  "lib/",
  "registry/examples/",
]
const forbiddenSourceMarkers = [
  "@efferd",
  "@vivid-layer-pro",
  "collectui.pro",
  "EFFERD_REGISTRY_TOKEN",
  "registry-pro",
  "components/docs/install-command-toolbar-preview",
  "V0Icon",
  "CursorIcon",
  "LovableIcon",
  "lovablebrand.lovable.app",
]

const rootEntries = await readdir(repositoryRoot)
for (const entry of rootEntries) {
  if (!allowedRootEntries.has(entry)) {
    throw new Error(`Unexpected public repository root entry: ${entry}`)
  }
}

const registrySourceFiles = new Set()
for (const item of registry.items) {
  if (JSON.stringify(item).includes("@vivid-layer-pro")) {
    throw new Error(`Private Registry item leaked into public source: ${item.name}`)
  }

  for (const file of item.files ?? []) {
    const sourcePath = normalizeRepositoryPath(file.path)
    if (
      !allowedRegistrySourceRoots.some((root) =>
        sourcePath.startsWith(root)
      )
    ) {
      throw new Error(
        `Registry item references a disallowed path: ${item.name} -> ${sourcePath}`
      )
    }
    registrySourceFiles.add(sourcePath)
  }
}

const exportedRegistrySourceFiles = new Set()
for (const sourceRoot of allowedRegistrySourceRoots) {
  const sourceFiles = await collectFiles(
    path.join(repositoryRoot, sourceRoot)
  )
  for (const absolutePath of sourceFiles) {
    const sourcePath = normalizeRepositoryPath(
      path
        .relative(repositoryRoot, absolutePath)
        .split(path.sep)
        .join(path.posix.sep)
    )
    exportedRegistrySourceFiles.add(sourcePath)
  }
}

for (const sourcePath of exportedRegistrySourceFiles) {
  if (!registrySourceFiles.has(sourcePath)) {
    throw new Error(
      `Unreferenced source file leaked into public source: ${sourcePath}`
    )
  }
}

for (const sourcePath of registrySourceFiles) {
  const absolutePath = path.join(repositoryRoot, sourcePath)
  const sourceStat = await lstat(absolutePath)
  if (!sourceStat.isFile() || sourceStat.isSymbolicLink()) {
    throw new Error(`Public Registry source must be a regular file: ${sourcePath}`)
  }

  const source = await readFile(absolutePath, "utf8")
  const leakedMarker = forbiddenSourceMarkers.find((marker) =>
    source.includes(marker)
  )
  if (leakedMarker) {
    throw new Error(
      `Private marker "${leakedMarker}" leaked into ${sourcePath}`
    )
  }
}

const provenance = await readFile(
  path.join(repositoryRoot, "ASSET_PROVENANCE.md"),
  "utf8"
)
const weatherAssetRecords = [
  ...provenance.matchAll(/\| `([^`]+\.webp)` \| `([0-9a-f]{64})` \|/g),
]

if (weatherAssetRecords.length !== 10) {
  throw new Error(
    `Expected 10 weather asset provenance records, found ${weatherAssetRecords.length}.`
  )
}

for (const [, filename, expectedHash] of weatherAssetRecords) {
  const source = await readFile(
    path.join(repositoryRoot, "public", "weather-assets", filename)
  )
  const actualHash = createHash("sha256").update(source).digest("hex")
  if (actualHash !== expectedHash) {
    throw new Error(`Weather asset integrity check failed: ${filename}`)
  }
}

console.log(
  `Public boundary is valid: ${registry.items.length} Registry items, ${registrySourceFiles.size} source files, and 10 verified weather assets.`
)

function normalizeRepositoryPath(filePath) {
  const normalized = path.posix.normalize(filePath)
  if (
    path.posix.isAbsolute(normalized) ||
    normalized === ".." ||
    normalized.startsWith("../")
  ) {
    throw new Error(`Invalid repository path: ${filePath}`)
  }

  return normalized
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name)
    if (entry.isSymbolicLink()) {
      throw new Error(`Public source does not accept symlinks: ${entryPath}`)
    }
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)))
      continue
    }
    if (entry.isFile()) files.push(entryPath)
  }

  return files
}
