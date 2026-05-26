import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [timer, setTimer] = useState(59);
  const [loading, setLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const otpSlideAnim = useRef(new Animated.Value(20)).current;
  const otpFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Timer countdown for OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      setIsOtpSent(true);
      setTimer(59);

      // Animate OTP entry slide-in
      Animated.parallel([
        Animated.timing(otpFadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(otpSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 1500);
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit code.');
      return;
    }
    setLoading(true);

    // Simulate OTP verification and location permission prompt
    setTimeout(() => {
      setLoading(false);
      
      // Simulate native-like location dialog
      Alert.alert(
        'Allow "CivicTwin" to access your location?',
        'CivicTwin requires your precise GPS location to map civic reports accurately and let you report issues in Bhopal.',
        [
          {
            text: 'Don\'t Allow',
            onPress: () => {
              Alert.alert('Permission Denied', 'You will not be able to create real reports, but you can view the Bhopal dashboard.', [
                { text: 'OK', onPress: onLoginSuccess }
              ]);
            },
            style: 'cancel',
          },
          {
            text: 'Allow While Using App',
            onPress: () => {
              onLoginSuccess();
            },
          },
        ],
        { cancelable: false }
      );
    }, 1500);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <LinearGradient
          colors={['#0f172a', '#1e1b4b', '#020617']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Dynamic decorative light blobs */}
        <View style={[styles.glowBlob, { top: '15%', left: '10%', backgroundColor: '#10b981', opacity: 0.15 }]} />
        <View style={[styles.glowBlob, { bottom: '20%', right: '5%', backgroundColor: '#6366f1', opacity: 0.2 }]} />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <Animated.View style={[styles.cardContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <BlurView intensity={25} tint="dark" style={styles.blurCard}>
              
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.logoText}>CivicTwin</Text>
                <Text style={styles.tagline}>Bhopal's AI 3D Digital Twin Command Center</Text>
              </View>

              {!isOtpSent ? (
                /* Phone Number Input View */
                <View style={styles.inputSection}>
                  <Text style={styles.label}>Enter Phone Number</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.prefix}>+91</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="98765 43210"
                      placeholderTextColor="#64748b"
                      keyboardType="phone-pad"
                      maxLength={10}
                      value={phoneNumber}
                      onChangeText={setPhoneNumber}
                      editable={!loading}
                    />
                  </View>
                  <Text style={styles.infoText}>
                    We will send a 6-digit one-time password to verify your device.
                  </Text>

                  <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleSendOtp}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#10b981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? 'Sending OTP...' : 'Send Verification Code'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                /* OTP Verification View */
                <Animated.View style={[styles.inputSection, { opacity: otpFadeAnim, transform: [{ translateY: otpSlideAnim }] }]}>
                  <Text style={styles.label}>Enter 6-Digit OTP</Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="000 000"
                    placeholderTextColor="#64748b"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otpCode}
                    onChangeText={setOtpCode}
                    editable={!loading}
                  />

                  <View style={styles.timerRow}>
                    {timer > 0 ? (
                      <Text style={styles.timerText}>Resend code in <Text style={styles.boldTimer}>{timer}s</Text></Text>
                    ) : (
                      <TouchableOpacity onPress={handleSendOtp} disabled={loading}>
                        <Text style={styles.resendText}>Resend OTP</Text>
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
                      colors={['#10b981', '#059669']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => setIsOtpSent(false)}
                    disabled={loading}
                  >
                    <Text style={styles.backButtonText}>Back to Phone Input</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}

            </BlurView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  blurCard: {
    padding: 32,
    alignItems: 'stretch',
  },
  glowBlob: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined, // blur filter on web
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#e2e8f0',
    fontWeight: '600',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 56,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    height: '100%',
  },
  otpInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    height: 56,
    fontSize: 22,
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 8,
    fontWeight: '700',
    paddingHorizontal: 16,
  },
  infoText: {
    fontSize: 12,
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
    color: '#94a3b8',
  },
  boldTimer: {
    fontWeight: '600',
    color: '#10b981',
  },
  resendText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#10b981',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 14,
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
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
