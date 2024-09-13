// THEOplayerRCTView+Ads.swift

import Foundation
import THEOplayerSDK

#if canImport(THEOplayerGoogleIMAIntegration)
import GoogleInteractiveMediaAds
#endif

struct AdsConfig {
    var adSUIEnabled: Bool = true
    var adsImaConfig = AdsImaConfig()
}

struct AdsImaConfig {
    var maxRedirects: UInt = 4
    var enableDebugMode: Bool = false
    var ppid: String?
    var featureFlags: [String:String]?
    var autoPlayAdBreaks: Bool?
    var sessionID: String?
    var bitrate: Int = kIMAAutodetectBitrate
}

#if os(iOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {
        if let adsConfig = configDict["ads"] as? NSDictionary {
            self.adsConfig.adSUIEnabled = adsConfig["uiEnabled"] as? Bool ?? true
            if let adsImaConfig = adsConfig["ima"] as? NSDictionary {
                if let ppid = adsImaConfig["ppid"] as? String {
                    self.adsConfig.adsImaConfig.ppid = ppid
                }
                if let maxRedirects = adsImaConfig["maxRedirects"] as? UInt {
                    self.adsConfig.adsImaConfig.maxRedirects = maxRedirects
                }
                if let featureFlags = adsImaConfig["featureFlags"] as? [String:String] {
                    self.adsConfig.adsImaConfig.featureFlags = featureFlags
                }
                if let autoPlayAdBreaks = adsImaConfig["autoPlayAdBreaks"] as? Bool {
                    self.adsConfig.adsImaConfig.autoPlayAdBreaks = autoPlayAdBreaks
                }
                if let sessionID = adsImaConfig["sessionID"] as? String {
                    self.adsConfig.adsImaConfig.sessionID = sessionID
                }
                if let enableDebugMode = adsImaConfig["enableDebugMode"] as? Bool {
                    self.adsConfig.adsImaConfig.enableDebugMode = enableDebugMode
                }
                self.adsConfig.adsImaConfig.bitrate = adsImaConfig["bitrate"] as? Int ?? kIMAAutodetectBitrate
            }
        }
    }
}

#elseif os(tvOS)

extension THEOplayerRCTView {
    
    func parseAdsConfig(configDict: NSDictionary) {}
    
}

#endif
