package com.flashbasket

import android.animation.ObjectAnimator
import android.app.Dialog
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.ProgressBar
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this)
    super.onCreate(null)

    Handler(Looper.getMainLooper()).postDelayed({
        try {
            val field = SplashScreen::class.java.getDeclaredField("mSplashDialog")
            field.isAccessible = true
            val dialog = field.get(null) as? Dialog
            dialog?.let {
                val progressBar = it.findViewById<ProgressBar>(R.id.loading_progress)
                progressBar?.let { pb ->
                    pb.max = 100
                    pb.isIndeterminate = false
                    val animator = ObjectAnimator.ofInt(pb, "progress", 0, 100)
                    animator.duration = 1500
                    animator.start()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }, 50)
  }

  override fun getMainComponentName(): String = "FlashBasket"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
