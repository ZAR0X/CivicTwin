import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView, BlurTargetView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/context/AppContext';
import { Fonts } from '@/constants/theme';

interface GlassContainerProps {
  children: React.ReactNode;
  style: any;
  intensity: number;
  tint: 'light' | 'dark';
  blurTarget?: React.RefObject<any>;
}

function GlassContainer({ children, style, intensity, tint, blurTarget }: GlassContainerProps) {
  if (Platform.OS === 'web') {
    return (
      <View 
        {...({ className: "acrylic-glass-card" } as any)} 
        style={style}
      >
        {children}
      </View>
    );
  }
  return (
    <BlurView 
      intensity={intensity} 
      tint={tint} 
      style={style}
      blurMethod="dimezisBlurView"
      blurTarget={blurTarget}
    >
      {children}
    </BlurView>
  );
}

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const backgroundRef = useRef<View>(null);
  const otpInputRef = useRef<TextInput>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpInputFocused, setIsOtpInputFocused] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Segmented OTP configuration
  const otpLength = 6;
  const otpArray = Array(otpLength).fill('');
  const handleOtpPress = () => {
    otpInputRef.current?.focus();
  };

  // Animation values
  const cardSlideAnim = useRef(new Animated.Value(400)).current; // Emerge from bottom
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.9)).current;

  // Statically white-themed login screen colors (Muted Pastels)
  const colors = {
    bg: ['#ffffff', '#ffffff'],
    text: '#000F08',
    textSecondary: '#334155', // Darker slate gray for better readability
    cardBg: 'rgba(255, 255, 255, 0.85)',
    inputBg: 'rgba(0, 15, 8, 0.03)',
    inputBorder: 'rgba(0, 15, 8, 0.08)',
    accentOrange: '#D88C51', // Muted pastel orange
    electricAqua: '#A9D8DC', // Muted pastel aqua
    onyx: '#000F08',
    azureMist: '#ffffff',
  };

  useEffect(() => {
    // Emerge and fade animations
    Animated.parallel([
      Animated.timing(logoFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(logoScaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(cardFadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsOtpSent(true);
      setTimer(59);
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 6) {
      alert('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowLocationPrompt(true); // Show our custom web-compatible permission modal
    }, 1200);
  };

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
      {/* Background Image covering the screen (inside BlurTargetView so it blurs correctly) */}
      <BlurTargetView ref={backgroundRef} style={StyleSheet.absoluteFill}>
        <Image
          source={require('@/assets/images/login_background.png')}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      </BlurTargetView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        enabled={Platform.OS !== 'web'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollStyle}
        >
          {/* Top Section with beautiful Graphic / Logo */}
          <Animated.View style={[
            styles.graphicSection, 
            { opacity: logoFadeAnim, transform: [{ scale: logoScaleAnim }] }
          ]}>
            <GlassContainer
              intensity={40}
              tint="light"
              style={styles.logoGlass}
              blurTarget={backgroundRef}
            >
              <MaterialCommunityIcons 
                name="city-variant-outline" 
                size={42} 
                color={colors.accentOrange} 
              />
            </GlassContainer>
            <Text style={[styles.logoText, { color: colors.text }]}>CivicTwin</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>
              Bhopal's AI 3D Digital Twin Command Center
            </Text>
          </Animated.View>

          {/* Bottom Emerging Login Card */}
          <Animated.View style={[
            styles.cardContainer,
            {
              backgroundColor: 'transparent',
              opacity: cardFadeAnim,
              transform: [{ translateY: cardSlideAnim }],
            }
          ]}>
            <GlassContainer
              intensity={40}
              tint="light"
              style={[styles.blurCard, { backgroundColor: colors.cardBg }]}
              blurTarget={backgroundRef}
            >
              {!isOtpSent ? (
                /* Phone Input Form */
                <View style={styles.formContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Mobile Number</Text>
                  
                  <View style={[styles.inputWrapper, { borderColor: colors.inputBorder }]}>
                    <Text style={[styles.prefix, { color: colors.text }]}>+91</Text>
                    <TextInput
                      style={[styles.input, { color: colors.text }]}
                      placeholder="Enter your 10 digit phone number"
                      placeholderTextColor="#94a3b8"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      editable={!loading}
                    />
                  </View>

                  <Text style={styles.infoText}>
                    Enter your number to sign in. We will send a secure verification code.
                  </Text>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSendOtp}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.accentOrange, '#E7A87C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Send OTP Code</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                /* OTP Code Form */
                <View style={styles.formContainer}>
                  <Text style={[styles.label, { color: colors.text }]}>Enter 6-Digit OTP</Text>
                  
                  {/* Hidden input to receive focus & text. Positioned off-screen, transparent caret */}
                  <TextInput
                    ref={otpInputRef}
                    style={styles.hiddenInput}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    keyboardType="number-pad"
                    maxLength={otpLength}
                    caretHidden={true}
                    onFocus={() => setIsOtpInputFocused(true)}
                    onBlur={() => setIsOtpInputFocused(false)}
                    editable={!loading}
                  />

                  {/* Visible segmented OTP slots */}
                  <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={handleOtpPress} 
                    style={styles.otpContainer}
                  >
                    {otpArray.map((_, index) => {
                      const char = otpCode[index] || '';
                      const isCurrentActive = index === otpCode.length && isOtpInputFocused;
                      
                      return (
                        <View 
                          key={index} 
                          style={[
                            styles.otpBox, 
                            { 
                              borderColor: isCurrentActive ? colors.accentOrange : colors.inputBorder 
                            }
                          ]}
                        >
                          {isCurrentActive ? (
                            <Text style={[styles.otpCursor, { color: colors.accentOrange }]}>_</Text>
                          ) : (
                            <Text style={[styles.otpChar, { color: colors.text }]}>{char}</Text>
                          )}
                        </View>
                      );
                    })}
                  </TouchableOpacity>

                  <View style={styles.timerRow}>
                    {timer > 0 ? (
                      <Text style={[styles.timerText, { color: colors.textSecondary }]}>
                        Resend in <Text style={{ color: colors.accentOrange, fontWeight: 'bold' }}>{timer}s</Text>
                      </Text>
                    ) : (
                      <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                        <Text style={[styles.resendText, { color: colors.accentOrange }]}>Resend OTP</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleVerifyOtp}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={[colors.accentOrange, '#E7A87C']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Text style={styles.buttonText}>Verify & Continue</Text>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setIsOtpSent(false)}
                    disabled={loading}
                  >
                    <Text style={[styles.backButtonText, { color: colors.textSecondary }]}>
                      Change Phone Number
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </GlassContainer>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Cross-Platform Web-Compatible Permission Prompt */}
      {showLocationPrompt && (
        <View style={styles.promptBg}>
          <GlassContainer
            intensity={50}
            tint="light"
            style={[styles.promptContainer, { backgroundColor: colors.cardBg }]}
            blurTarget={backgroundRef}
          >
            <View style={styles.promptIconWrapper}>
              <MaterialCommunityIcons 
                name="map-marker-radius-outline" 
                size={32} 
                color={colors.accentOrange} 
              />
            </View>
            
            <Text style={styles.promptTitle}>Enable Location Access</Text>
            <Text style={styles.promptDesc}>
              CivicTwin Bhopal needs your location to plot dynamic heatmaps and submit reporting pins with precise GPS coordinates.
            </Text>

            <View style={styles.promptActions}>
              <TouchableOpacity 
                style={styles.promptBtnSecondary}
                onPress={onLoginSuccess}
              >
                <Text style={styles.promptBtnTextSecondary}>Don't Allow</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.promptBtnPrimary}
                onPress={onLoginSuccess}
              >
                <LinearGradient
                  colors={[colors.accentOrange, '#E7A87C']}
                  style={styles.promptGradient}
                >
                  <Text style={styles.promptBtnTextPrimary}>Allow Access</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </GlassContainer>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
  },
  scrollStyle: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    width: '100%',
  },
  graphicSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoGlass: {
    width: 76,
    height: 76,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
    fontFamily: Fonts.rounded,
  },
  tagline: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: Fonts.sans,
  },
  cardContainer: {
    width: '90%',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  blurCard: {
    paddingTop: 36,
    paddingBottom: Platform.OS === 'ios' ? 44 : 36,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: Fonts.rounded,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: Fonts.sans,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
    borderWidth: 0,
    outlineStyle: 'none',
    fontFamily: Fonts.sans,
  } as any,
  hiddenInput: {
    position: 'absolute',
    left: -9999,
    width: 1,
    height: 1,
    opacity: 0,
    ...Platform.select({
      web: {
        caretColor: 'transparent',
        color: 'transparent',
      }
    })
  } as any,
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingHorizontal: 4,
  },
  otpBox: {
    width: 42,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  otpChar: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
  },
  otpCursor: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
  },
  infoText: {
    fontSize: 11,
    color: '#334155',
    marginTop: 10,
    lineHeight: 16,
    fontFamily: Fonts.sans,
  },
  timerRow: {
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 13,
    fontFamily: Fonts.sans,
  },
  resendText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    fontFamily: Fonts.rounded,
  },
  backButton: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
  promptBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 15, 8, 0.35)',
    padding: 24,
  },
  promptContainer: {
    width: '90%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  promptIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(216, 140, 81, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000F08',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Fonts.rounded,
  },
  promptDesc: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    fontFamily: Fonts.sans,
  },
  promptActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  promptBtnSecondary: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  promptBtnTextSecondary: {
    color: '#334155',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
  promptBtnPrimary: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    overflow: 'hidden',
  },
  promptGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptBtnTextPrimary: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: Fonts.rounded,
  },
});
