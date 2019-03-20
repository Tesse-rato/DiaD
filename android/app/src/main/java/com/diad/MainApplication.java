package com.diad;

import android.app.Application;

import com.facebook.react.ReactApplication;
<<<<<<< HEAD
import com.bitgo.randombytes.RandomBytesPackage;
=======
import net.rhogan.rnsecurerandom.RNSecureRandomPackage;
>>>>>>> d8748495e31e88bcbd7e134e3a266236dbd943ae
import com.imagepicker.ImagePickerPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.horcrux.svg.SvgPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
<<<<<<< HEAD
            new RandomBytesPackage(),
=======
            new RNSecureRandomPackage(),
>>>>>>> d8748495e31e88bcbd7e134e3a266236dbd943ae
            new ImagePickerPackage(),
            new RNGestureHandlerPackage(),
            new SvgPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
