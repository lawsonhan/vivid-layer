import { AtSignIcon } from "lucide-react"

import {
  CropMarks,
  type CropMarksProps,
} from "@/components/ui/crop-marks"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { cn } from "@/lib/utils"

type CropMarksImageDemoProps = {
  cropMarksProps?: Pick<
    CropMarksProps,
    "layers" | "layerGap" | "overshoot" | "fade" | "className"
  >
}

export default function CropMarksImageDemo({
  cropMarksProps: { className, ...cropMarksProps } = {},
}: CropMarksImageDemoProps = {}) {
  return (
    <div className="flex h-[26rem] w-full items-center justify-center p-10 sm:p-14">
      <CropMarks
        className={cn("w-full max-w-sm", className)}
        layers="single"
        overshoot={48}
        {...cropMarksProps}
      >
        <section
          aria-labelledby="crop-marks-auth-title"
          className="relative w-full p-6 sm:p-8"
        >
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2
                className="text-2xl font-bold tracking-wide"
                id="crop-marks-auth-title"
              >
                Join Now!
              </h2>
              <p className="text-base text-muted-foreground">
                Login or create your Vivid Layer account.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <form className="flex flex-col gap-2">
                <InputGroup>
                  <InputGroupInput
                    aria-label="Email address"
                    placeholder="your.email@example.com"
                    type="email"
                  />
                  <InputGroupAddon align="inline-start">
                    <AtSignIcon />
                  </InputGroupAddon>
                </InputGroup>

                <Button className="w-full" type="button">
                  Continue With Email
                </Button>
              </form>

              <p className="text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <a
                  className="underline underline-offset-4 hover:text-primary"
                  href="/terms"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  className="underline underline-offset-4 hover:text-primary"
                  href="/privacy"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </CropMarks>
    </div>
  )
}
