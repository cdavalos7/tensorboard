load("//tensorboard/defs:defs.bzl", "tf_ng_module", "tf_sass_binary", "tf_ts_library")

package(default_visibility = ["//tensorboard:internal"])

licenses(["notice"])

tf_sass_binary(
    name = "list_styles",
    src = "list_component.scss",
)

tf_ng_module(
    name = "list",
    srcs = [
        "list_component.ts",
        "list_module.ts",
    ],
    assets = [
        ":list_styles",
    ],
    deps = [
        "//tensorboard/webapp/angular:expect_angular_material_list",
        "@npm//@angular/common",
        "@npm//@angular/core",
    ],
)

tf_ts_library(
    name = "list_tests",
    testonly = True,
    srcs = ["list_component_test.ts"],
    deps = [
        ":list",
        "//tensorboard/webapp/angular:expect_angular_core_testing",
        "//tensorboard/webapp/angular:expect_angular_material_list",
        "//tensorboard/webapp/angular:expect_angular_platform_browser_animations",
        "@npm//@angular/common",
        "@npm//@angular/core",
        "@npm//@angular/platform-browser",
        "@npm//@types/jasmine",
    ],
)
