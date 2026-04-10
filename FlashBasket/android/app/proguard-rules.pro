# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.devsupport.** { *; }

# Reanimated
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# Screens
-keep class com.swmansion.rnscreens.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# FastImage (Glide)
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep public class * extends com.bumptech.glide.module.LibraryGlideModule
-keep class com.bumptech.glide.GeneratedAppGlideModuleImpl { *; }
-keep class com.bumptech.glide.GeneratedAppGlideModule { *; }
-dontwarn com.bumptech.glide.**

# Stripe
-dontwarn com.stripe.android.pushProvisioning.**
-keep class com.reactnativestripesdk.** { *; }

# Worklets (Used by Reanimated)
-keep class com.swmansion.worklets.** { *; }

# OkHttp
-keepattributes Signature
-keepattributes *Annotation*
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }
-dontwarn okhttp3.**
