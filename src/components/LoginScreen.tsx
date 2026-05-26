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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '@/context/AppContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { theme, toggleTheme } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  // Animation values
  const cardSlideAnim = useRef(new Animated.Value(400)).current; // Emerge from bottom
  const cardFadeAnim = useRef(new Animated.Value(0)).current;
  const logoFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.9)).current;

  // Colors based on palette: Onyx (000F08), Pumpkin Spice (FF6F00), Azure Mist (F4FFFE), Electric Aqua (92E5EC)
  const isDark = theme === 'dark';
  
  const colors = {
    bg: isDark ? ['#000F08', '#011c10', '#000000'] : ['#F4FFFE', '#e0fcf9', '#ffffff'],
    text: isDark ? '#ffffff' : '#000F08',
    textSecondary: isDark ? '#92E5EC' : '#475569',
    cardBg: isDark ? 'rgba(0, 15, 8, 0.75)' : 'rgba(244, 255, 254, 0.85)',
    inputBg: isDark ? 'rgba(146, 229, 236, 0.05)' : 'rgba(0, 15, 8, 0.03)',
    inputBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    accentOrange: '#FF6F00',
    electricAqua: '#92E5EC',
    onyx: '#000F08',
    azureMist: '#F4FFFE',
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
    <View style={[styles.container, { backgroundColor: isDark ? '#000F08' : '#F4FFFE' }]}>
      {/* Dynamic Background Gradients */}
      <LinearGradient
        colors={colors.bg as any}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative Blur Orbs */}
      <View style={[styles.glowBlob, { 
        top: '10%', 
        right: '-10%', 
        backgroundColor: colors.accentOrange, 
        opacity: isDark ? 0.15 : 0.1 
      }]} />
      <View style={[styles.glowBlob, { 
        bottom: '30%', 
        left: '-10%', 
        backgroundColor: colors.electricAqua, 
        opacity: isDark ? 0.2 : 0.15 
      }]} />

      {/* Theme Switcher Button */}
      <TouchableOpacity 
        style={[styles.themeToggle, { borderColor: colors.inputBorder }]} 
        onPress={toggleTheme}
      >
        <Text style={styles.themeToggleText}>
          {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </Text>
      </TouchableOpacity>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        {/* Top Section with beautiful Graphic / Logo */}
        <Animated.View style={[
          styles.graphicSection, 
          { opacity: logoFadeAnim, transform: [{ scale: logoScaleAnim }] }
        ]}>
          <LinearGradient
            colors={[colors.accentOrange, colors.electricAqua]}
            style={styles.logoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.logoEmoji}>🏙️</Text>
          </LinearGradient>
          <Text style={[styles.logoText, { color: colors.text }]}>CivicTwin</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            Bhopal's AI 3D Digital Twin Command Center
          </Text>
        </Animated.View>

        {/* Bottom Emerging Login Card (Full-width, no borders, sliding up) */}
        <Animated.View style={[
          styles.cardContainer,
          {
            backgroundColor: colors.cardBg,
            opacity: cardFadeAnim,
            transform: [{ translateY: cardSlideAnim }],
          }
        ]}>
          <BlurView intensity={isDark ? 20 : 40} tint={isDark ? 'dark' : 'light'} style={styles.blurCard}>
            
            {!isOtpSent ? (
              /* Phone Input Form */
              <View style={styles.formContainer}>
                <Text style={[styles.label, { color: colors.text }]}>Mobile Number</Text>
                
                <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                  <Text style={[styles.prefix, { color: colors.text }]}>+91</Text>
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="98765 43210"
                    placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
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
                    colors={['#FF6F00', '#FF8F33']}
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
                
                <TextInput
                  style={[styles.otpInput, { 
                    backgroundColor: colors.inputBg, 
                    borderColor: colors.inputBorder,
                    color: colors.text
                  }]}
                  placeholder="000000"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  editable={!loading}
                />

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
                    colors={['#FF6F00', '#FF8F33']}
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

          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Custom Cross-Platform Web-Compatible Permission Prompt */}
      {showLocationPrompt && (
        <View style={styles.promptBg}>
          <BlurView intensity={50} tint="dark" style={styles.promptContainer}>
            <View style={styles.promptIconWrapper}>
              <Text style={styles.promptIcon}>📍</Text>
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
                  colors={['#FF6F00', '#FF8F33']}
                  style={styles.promptGradient}
                >
                  <Text style={styles.promptBtnTextPrimary}>Allow Access</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  glowBlob: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
  },
  themeToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 99,
  },
  themeToggleText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FF6F00',
  },
  keyboardView: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  graphicSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0 0 20px rgba(255, 111, 0, 0.3)',
  },
  logoEmoji: {
    fontSize: 38,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardContainer: {
    width: '100%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  blurCard: {
    paddingTop: 36,
    paddingBottom: Platform.OS === 'ios' ? 48 : 36,
    paddingHorizontal: 28,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  prefix: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
    borderWidth: 0,
    outlineStyle: 'none', // fixes blue outlines in browsers
  } as any,
  otpInput: {
    borderRadius: 16,
    borderWidth: 1,
    height: 56,
    fontSize: 22,
    textAlign: 'center',
    letterSpacing: 6,
    fontWeight: 'bold',
    outlineStyle: 'none',
  } as any,
  infoText: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 10,
    lineHeight: 16,
  },
  timerRow: {
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 13,
  },
  resendText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    boxShadow: '0 0 15px rgba(255, 111, 0, 0.4)',
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
  },
  backButton: {
    alignItems: 'center',
    marginTop: 18,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  
  // Custom Web-compatible Location Permission prompt
  promptBg: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 15, 8, 0.4)',
    padding: 24,
  },
  promptContainer: {
    width: '90%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  promptIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 111, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  promptIcon: {
    fontSize: 28,
  },
  promptTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  promptDesc: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
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
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptBtnTextSecondary: {
    color: '#cbd5e1',
    fontWeight: 'bold',
    fontSize: 14,
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
  },
});
