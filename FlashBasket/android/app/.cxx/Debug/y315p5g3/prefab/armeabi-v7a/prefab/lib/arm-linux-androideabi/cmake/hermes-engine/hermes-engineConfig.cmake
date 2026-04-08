if(NOT TARGET hermes-engine::hermesvm)
add_library(hermes-engine::hermesvm SHARED IMPORTED)
set_target_properties(hermes-engine::hermesvm PROPERTIES
    IMPORTED_LOCATION "/home/dev-05/.gradle/caches/9.0.0/transforms/a80e6232511059ebe3bfd77d830e40aa/transformed/jetified-hermes-android-250829098.0.9-debug/prefab/modules/hermesvm/libs/android.armeabi-v7a/libhermesvm.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/dev-05/.gradle/caches/9.0.0/transforms/a80e6232511059ebe3bfd77d830e40aa/transformed/jetified-hermes-android-250829098.0.9-debug/prefab/modules/hermesvm/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

