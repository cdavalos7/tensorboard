load("@io_bazel_rules_webtesting//web:web.bzl", "browser")

package(
    default_testonly = True,
    default_visibility = ["//visibility:public"],
)

# Custom browser definition for Chrome 123. Uses new headless mode (default
# --headless) with es2021 bundle target; es2022 class static blocks trigger a
# V8 crash in Chrome 123 headless that does not affect es2021 output.
browser(
    name = "chromium-local",
    metadata = "chromium-local.json",
    required_tags = ["native"],
    deps = [
        "@io_bazel_rules_webtesting//go/wsl",
    ] + select({
        "@io_bazel_rules_webtesting//common/conditions:linux_x64": [
            "@org_chromium_chromium_linux_x64//:metadata",
            "@org_chromium_chromedriver_linux_x64//:metadata",
        ],
        "@io_bazel_rules_webtesting//common/conditions:macos_x64": [
            "@org_chromium_chromium_macos_x64//:metadata",
            "@org_chromium_chromedriver_macos_x64//:metadata",
        ],
        "@io_bazel_rules_webtesting//common/conditions:macos_arm64": [
            "@org_chromium_chromium_macos_arm64//:metadata",
            "@org_chromium_chromedriver_macos_arm64//:metadata",
        ],
        "@io_bazel_rules_webtesting//common/conditions:windows_x64": [
            "@org_chromium_chromium_windows_x64//:metadata",
            "@org_chromium_chromedriver_windows_x64//:metadata",
        ],
    }),
)
