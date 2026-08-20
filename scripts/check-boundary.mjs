import { createHash } from "node:crypto"
import { lstat, readFile, readdir } from "node:fs/promises"
import path from "node:path"

const repositoryRoot = path.resolve(import.meta.dirname, "..")
const registry = JSON.parse(
  await readFile(path.join(repositoryRoot, "registry.json"), "utf8")
)
const publicRepositoryUrl = "https://github.com/lawsonhan/vivid-layer"
const publicRepositoryGitUrl = `${publicRepositoryUrl}.git`
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
const requiredRootEntries = [
  "ASSET_PROVENANCE.md",
  "CONTRIBUTING.md",
  "LICENSE",
  "NOTICE",
  "README.md",
  "THIRD_PARTY_NOTICES.md",
  "package.json",
  "pnpm-lock.yaml",
  "registry.json",
]
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

for (const entry of requiredRootEntries) {
  if (!rootEntries.includes(entry)) {
    throw new Error(`Missing required public repository root entry: ${entry}`)
  }
}

const license = await readFile(
  path.join(repositoryRoot, "LICENSE"),
  "utf8"
)
for (const marker of [
  "Vivid Layer Community License, Version 1.0",
  "Copyright (c) 2026 Lawson Han",
  "This is a source-available license. It is not an open-source license.",
  "original additions and modifications",
  "Third-Party Material",
  "THIRD_PARTY_NOTICES.md",
]) {
  if (!license.includes(marker)) {
    throw new Error(`Public LICENSE is missing required text: ${marker}`)
  }
}

const packageMetadata = JSON.parse(
  await readFile(path.join(repositoryRoot, "package.json"), "utf8")
)
if (packageMetadata.license !== "SEE LICENSE IN LICENSE") {
  throw new Error(
    'Public package.json must declare "SEE LICENSE IN LICENSE".'
  )
}

const packageRepositoryUrl =
  typeof packageMetadata.repository === "string"
    ? packageMetadata.repository
    : packageMetadata.repository?.url
if (packageRepositoryUrl !== publicRepositoryGitUrl) {
  throw new Error(
    `Public package.json repository must be ${publicRepositoryGitUrl}.`
  )
}

if (registry.homepage !== publicRepositoryUrl) {
  throw new Error(`Registry homepage must be ${publicRepositoryUrl}.`)
}

const readme = await readFile(
  path.join(repositoryRoot, "README.md"),
  "utf8"
)
for (const marker of [
  "source-available",
  "Vivid Layer Community License 1.0",
  "personal and commercial end",
  "component libraries",
  "Third-party portions",
  `${publicRepositoryUrl}/issues`,
]) {
  if (!readme.includes(marker)) {
    throw new Error(`Public README is missing required text: ${marker}`)
  }
}

const contributing = await readFile(
  path.join(repositoryRoot, "CONTRIBUTING.md"),
  "utf8"
)
if (!contributing.includes("not accepting external pull requests")) {
  throw new Error(
    "Public contribution terms must reject external code contributions."
  )
}

const thirdPartyNotices = await readFile(
  path.join(repositoryRoot, "THIRD_PARTY_NOTICES.md"),
  "utf8"
)
if (!thirdPartyNotices.includes("excluded from that license")) {
  throw new Error(
    "Third-party notices must state the Community License exclusion."
  )
}

const registrySourceFiles = new Set()
for (const item of registry.items) {
  if (item.name === "line-waveform" || item.name === "line-waveform-demo") {
    throw new Error("Line Waveform must not be a standalone Registry item.")
  }

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
