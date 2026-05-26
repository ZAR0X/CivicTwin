import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Image,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getMapHtml, BHOPAL_COORDINATES } from '@/constants/mapHtml';
import { useApp, Report } from '@/context/AppContext';

export default function HomeScreen() {
  const { theme, toggleTheme, reports, userPoints, addReport, verifyReport } = useApp();
  const [mapMode, setMapMode] = useState<'3d' | 'satellite'>('3d');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  
  // Reporting state
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [clickCoords, setClickCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [cameraCaptured, setCameraCaptured] = useState(false);
  
  // AI Mocked Result State
  const [mockedAiResult, setMockedAiResult] = useState<{
    category: string;
    severity: number;
    description: string;
    department: string;
  } | null>(null);

  // Animation values for earning points
  const [pointsOverlayVisible, setPointsOverlayVisible] = useState(false);
  const [earnedPointsAmount, setEarnedPointsAmount] = useState(0);

  const webViewRef = useRef<WebView>(null);
  const iframeRef = useRef<any>(null);

  const mapHtml = getMapHtml(reports);

  // Colors based on palette: Onyx (000F08), Pumpkin Spice (FF6F00), Azure Mist (F4FFFE), Electric Aqua (92E5EC)
  const isDark = theme === 'dark';

  const palette = {
    bg: isDark ? '#000F08' : '#F4FFFE',
    bgGradient: isDark ? ['#000F08', '#01120a', '#000000'] : ['#F4FFFE', '#e6fcf9', '#ffffff'],
    text: isDark ? '#ffffff' : '#000F08',
    textSecondary: isDark ? '#92E5EC' : '#475569',
    cardBg: isDark ? 'rgba(0, 15, 8, 0.75)' : 'rgba(244, 255, 254, 0.85)',
    cardBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    inputBg: isDark ? 'rgba(146, 229, 236, 0.05)' : 'rgba(0, 15, 8, 0.03)',
    inputBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    accentOrange: '#FF6F00',
    electricAqua: '#92E5EC',
    onyx: '#000F08',
    azureMist: '#F4FFFE',
  };

  // Sync reports list updates into WebView
  useEffect(() => {
    const jsonStr = JSON.stringify(reports);
    if (Platform.OS === 'web') {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ type: 'updateReports', list: reports }),
          '*'
        );
      }
    } else {
      webViewRef.current?.injectJavaScript(`
        if (window.updateReports) {
          window.updateReports(${jsonStr});
        }
        void(0);
      `);
    }
  }, [reports]);

  // Sync theme changes into WebView Map style
  useEffect(() => {
    if (Platform.OS === 'web') {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ type: 'setMapTheme', theme: theme }),
          '*'
        );
      }
    } else {
      webViewRef.current?.injectJavaScript(`
        if (window.setMapTheme) {
          window.setMapTheme("${theme}");
        }
        void(0);
      `);
    }
  }, [theme]);

  // Handle Map Mode changes
  const handleToggleMapMode = () => {
    const nextMode = mapMode === '3d' ? 'satellite' : '3d';
    setMapMode(nextMode);

    if (Platform.OS === 'web') {
      iframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ type: 'toggleMapMode', mode: nextMode }),
        '*'
      );
    } else {
      webViewRef.current?.injectJavaScript(`
        if (window.toggleMapMode) {
          window.toggleMapMode("${nextMode}");
        }
        void(0);
      `);
    }
  };

  // Receive message events from HTML Map
  const handleMessage = (data: any) => {
    if (data.type === 'SHOW_REPORT') {
      setSelectedReport(data.data);
    } else if (data.type === 'MAP_CLICK') {
      setClickCoords(data.coordinates);
      setIsReportModalVisible(true);
      resetReportFlow();
    }
  };

  // Reset variables for new report flow
  const resetReportFlow = () => {
    setTypedMessage('');
    setVoiceActive(false);
    setAiLoading(false);
    setAiAnalysisComplete(false);
    setCameraCaptured(false);
    setMockedAiResult(null);
  };

  // Simulate camera click
  const handleCapturePhoto = () => {
    setCameraCaptured(true);
  };

  // Simulate Speech-to-Text Voice Recording
  const handleVoiceInput = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      setTypedMessage('Pothole is overflowing with rainwater, sewage smells bad.');
    }, 2000);
  };

  // Trigger Mock Gemini 1.5 Flash AI Processing
  const handleRunAiAnalysis = () => {
    if (!cameraCaptured) return;
    setAiLoading(true);

    // Mock 2.5 seconds delay for Gemini AI analysis
    setTimeout(() => {
      setAiLoading(false);
      setAiAnalysisComplete(true);

      const lowerText = typedMessage.toLowerCase();
      if (lowerText.includes('water') || lowerText.includes('sewage') || lowerText.includes('leak')) {
        setMockedAiResult({
          category: 'Water',
          severity: 8,
          description: 'Visual evidence shows municipal water main leak flooding road. Secondary risk: local flooding.',
          department: 'Water Works Department',
        });
      } else if (lowerText.includes('garbage') || lowerText.includes('smells') || lowerText.includes('dustbin')) {
        setMockedAiResult({
          category: 'Sanitation',
          severity: 6,
          description: 'Overflowing community trash bin. Piles of organic garbage leaking onto footpaths.',
          department: 'Sanitation Department',
        });
      } else if (lowerText.includes('electric') || lowerText.includes('wire') || lowerText.includes('light')) {
        setMockedAiResult({
          category: 'Utility',
          severity: 9,
          description: 'Fallen live wire near public area. High probability of electric shock hazard.',
          department: 'MPEB (Electricity Board)',
        });
      } else {
        setMockedAiResult({
          category: 'Roads',
          severity: 7,
          description: 'Deep road cavity (pothole) measuring ~15cm deep. High risk of two-wheeler accidents.',
          department: 'Municipal Corporation (PWD)',
        });
      }
    }, 2500);
  };

  // Submit report to state and map
  const handleSubmitReport = () => {
    if (!mockedAiResult || !clickCoords) return;

    addReport({
      coordinates: [clickCoords.longitude, clickCoords.latitude],
      category: mockedAiResult.category,
      severity: mockedAiResult.severity,
      description: mockedAiResult.description,
      image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500',
      department: mockedAiResult.department,
    });

    setIsReportModalVisible(false);
    
    // Play Points animations
    setEarnedPointsAmount(25);
    setPointsOverlayVisible(true);
    setTimeout(() => setPointsOverlayVisible(false), 3000);
  };

  // Upvote report (Community verification)
  const handleVerify = () => {
    if (!selectedReport) return;
    verifyReport(selectedReport.id);
    
    // Award +50 points
    setEarnedPointsAmount(50);
    setPointsOverlayVisible(true);
    setTimeout(() => setPointsOverlayVisible(false), 3000);
    
    setSelectedReport(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Map Rendering Container */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef}
            srcDoc={mapHtml}
            style={{ border: 'none', width: '100%', height: '100%' }}
            onLoad={() => {
              const listener = (event: any) => {
                try {
                  const data = JSON.parse(event.data);
                  handleMessage(data);
                } catch (e) {}
              };
              window.addEventListener('message', listener);
              
              // Set initial map theme on load
              setTimeout(() => {
                iframeRef.current?.contentWindow?.postMessage(
                  JSON.stringify({ type: 'setMapTheme', theme: theme }),
                  '*'
                );
              }, 1000);

              return () => window.removeEventListener('message', listener);
            }}
          />
        ) : (
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                handleMessage(data);
              } catch (e) {}
            }}
            onLoadEnd={() => {
              webViewRef.current?.injectJavaScript(`
                if (window.setMapTheme) {
                  window.setMapTheme("${theme}");
                }
                void(0);
              `);
            }}
            style={styles.webView}
          />
        )}
      </View>

      {/* Top Floating Branding & Settings Bar */}
      <SafeAreaView style={styles.topBar}>
        <View style={styles.topBarRow}>
          <BlurView intensity={isDark ? 25 : 55} tint={isDark ? 'dark' : 'light'} style={[styles.brandBadge, { borderColor: palette.cardBorder }]}>
            <Text style={[styles.brandTitle, { color: palette.text }]}>CivicTwin</Text>
            <View style={styles.statusPulse} />
          </BlurView>

          <View style={styles.rightBadges}>
            {/* Theme Selector Toggle */}
            <TouchableOpacity 
              style={[styles.themeBtn, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)', borderColor: palette.cardBorder }]}
              onPress={toggleTheme}
            >
              <Text style={styles.themeBtnEmoji}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>

            {/* Scorecard */}
            <BlurView intensity={isDark ? 25 : 55} tint={isDark ? 'dark' : 'light'} style={[styles.pointsBadge, { borderColor: palette.cardBorder }]}>
              <Text style={styles.pointsEmoji}>🏆</Text>
              <Text style={[styles.pointsText, { color: palette.text }]}>{userPoints} pts</Text>
            </BlurView>
          </View>
        </View>
      </SafeAreaView>

      {/* Floating Toggle Buttons (Satellite / 3D) */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.circleBtn} onPress={handleToggleMapMode} activeOpacity={0.8}>
          <BlurView intensity={isDark ? 25 : 55} tint={isDark ? 'dark' : 'light'} style={[styles.circleBlur, { borderColor: palette.cardBorder }]}>
            <Text style={styles.controlIcon}>{mapMode === '3d' ? '📡' : '🏙️'}</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Floating Bottom Sheet Report Details view */}
      {selectedReport && (
        <View style={styles.detailOverlay}>
          <BlurView intensity={isDark ? 30 : 60} tint={isDark ? 'dark' : 'light'} style={[styles.detailCard, { borderColor: palette.cardBorder }]}>
            <View style={styles.cardIndicator} />
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <View style={styles.detailHeader}>
                <View>
                  <Text style={[styles.categoryBadge, { color: palette.accentOrange }]}>{selectedReport.category}</Text>
                  <Text style={[styles.departmentName, { color: palette.textSecondary }]}>{selectedReport.department}</Text>
                </View>
                <View style={[
                  styles.severityBadge,
                  selectedReport.severity >= 8 ? styles.bgHigh : selectedReport.severity >= 5 ? styles.bgMedium : styles.bgLow
                ]}>
                  <Text style={styles.severityText}>Severity: {selectedReport.severity}/10</Text>
                </View>
              </View>

              <Image source={{ uri: selectedReport.image }} style={styles.detailImage} />

              <Text style={[styles.reportDesc, { color: palette.text }]}>{selectedReport.description}</Text>

              <View style={[styles.metadataRow, { borderColor: palette.cardBorder }]}>
                <Text style={[styles.metaLabel, { color: palette.textSecondary }]}>Status: <Text style={{ color: palette.text, fontWeight: 'bold' }}>{selectedReport.status}</Text></Text>
                <Text style={[styles.metaLabel, { color: palette.textSecondary }]}>Date: <Text style={{ color: palette.text, fontWeight: 'bold' }}>{selectedReport.date}</Text></Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.verifyButton, selectedReport.verifiedByUser && styles.verifiedButtonDisabled]}
                  onPress={handleVerify}
                  disabled={selectedReport.verifiedByUser}
                >
                  <LinearGradient
                    colors={selectedReport.verifiedByUser ? ['#475569', '#334155'] : [palette.accentOrange, '#d95f00']}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionBtnText}>
                      {selectedReport.verifiedByUser ? '✓ Verified' : '👍 I See This Too (+50 pts)'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.closeButton, { borderColor: palette.cardBorder }]} onPress={() => setSelectedReport(null)}>
                  <Text style={[styles.closeBtnText, { color: palette.text }]}>Dismiss</Text>
                </TouchableOpacity>
              </View>

            </ScrollView>
          </BlurView>
        </View>
      )}

      {/* Main Glowing Floating Action Button (FAB) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabBtn}
          activeOpacity={0.85}
          onPress={() => {
            setClickCoords({ latitude: 23.2324, longitude: 77.4262 });
            setIsReportModalVisible(true);
            resetReportFlow();
          }}
        >
          <LinearGradient
            colors={[palette.accentOrange, '#e65c00']}
            style={styles.fabGradient}
          >
            <Text style={styles.fabText}>🚨 Report Issue</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={[styles.fabHint, { color: palette.textSecondary }]}>
          Tap anywhere on map to report, or tap button
        </Text>
      </View>

      {/* Report Creation Modal */}
      <Modal
        visible={isReportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFillObject} />
          
          <View style={[styles.modalContent, { backgroundColor: palette.bg, borderColor: palette.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: palette.text }]}>File Civic Grievance</Text>
              <TouchableOpacity onPress={() => setIsReportModalVisible(false)}>
                <Text style={[styles.modalCloseIcon, { color: palette.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              
              {/* Step 1: Media Capture View */}
              <Text style={[styles.formLabel, { color: palette.textSecondary }]}>Step 1: Capture Photo Evidence</Text>
              {!cameraCaptured ? (
                <TouchableOpacity 
                  style={[styles.cameraBox, { backgroundColor: palette.inputBg, borderColor: palette.cardBorder }]} 
                  onPress={handleCapturePhoto}
                >
                  <Text style={styles.cameraIcon}>📸</Text>
                  <Text style={[styles.cameraLabel, { color: palette.text }]}>Tap to Capture Evidence</Text>
                  <Text style={[styles.cameraSubtext, { color: palette.textSecondary }]}>Simulate device camera photo capture</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.cameraPreviewContainer}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500' }}
                    style={styles.cameraPreview}
                  />
                  <TouchableOpacity style={styles.retakeBtn} onPress={() => setCameraCaptured(false)}>
                    <Text style={styles.retakeText}>Retake Photo</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Step 2: Context / Descriptions */}
              <Text style={[styles.formLabel, { color: palette.textSecondary }]}>Step 2: Add Details</Text>
              <TextInput
                style={[styles.messageInput, { 
                  backgroundColor: palette.inputBg, 
                  borderColor: palette.inputBorder,
                  color: palette.text 
                }]}
                placeholder="Describe the issue..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                multiline={true}
                value={typedMessage}
                onChangeText={setTypedMessage}
              />

              <View style={styles.voiceRow}>
                <TouchableOpacity
                  style={[styles.voiceBtn, { backgroundColor: palette.inputBg, borderColor: palette.inputBorder }, voiceActive && styles.voiceBtnActive]}
                  onPress={handleVoiceInput}
                >
                  <Text style={[styles.voiceIcon, { color: palette.text }]}>{voiceActive ? '🎙️ Recording...' : '🎤 Simulate Voice Input'}</Text>
                </TouchableOpacity>
              </View>

              {/* Step 3: Run AI Processing */}
              {cameraCaptured && !aiAnalysisComplete && (
                <TouchableOpacity
                  style={[styles.aiButton, aiLoading && styles.disabledBtn]}
                  onPress={handleRunAiAnalysis}
                  disabled={aiLoading}
                >
                  <LinearGradient
                    colors={[palette.accentOrange, '#e65c00']}
                    style={styles.aiButtonGradient}
                  >
                    {aiLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.aiButtonText}>🪄 Analyze with Gemini AI</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Step 4: AI Analysis Results Card */}
              {aiAnalysisComplete && mockedAiResult && (
                <View style={[styles.aiResultCard, { 
                  backgroundColor: isDark ? 'rgba(255, 111, 0, 0.05)' : 'rgba(255, 111, 0, 0.03)', 
                  borderColor: 'rgba(255, 111, 0, 0.3)' 
                }]}>
                  <Text style={[styles.aiResultHeader, { color: palette.accentOrange }]}>✦ CivicTwin AI Diagnostics</Text>
                  
                  <View style={styles.aiFieldRow}>
                    <Text style={[styles.aiFieldLabel, { color: palette.textSecondary }]}>Category:</Text>
                    <Text style={[styles.aiFieldValue, { color: palette.text }]}>{mockedAiResult.category}</Text>
                  </View>

                  <View style={styles.aiFieldRow}>
                    <Text style={[styles.aiFieldLabel, { color: palette.textSecondary }]}>Severity:</Text>
                    <Text style={[styles.aiFieldValue, { color: '#ef4444', fontWeight: 'bold' }]}>
                      {mockedAiResult.severity}/10
                    </Text>
                  </View>

                  <View style={styles.aiFieldRow}>
                    <Text style={[styles.aiFieldLabel, { color: palette.textSecondary }]}>Department:</Text>
                    <Text style={[styles.aiFieldValue, { color: palette.text }]}>{mockedAiResult.department}</Text>
                  </View>

                  <Text style={[styles.aiResultDesc, { color: palette.text, borderColor: palette.cardBorder }]}>{mockedAiResult.description}</Text>
                  
                  <Text style={[styles.locationTag, { color: palette.textSecondary }]}>📍 GPS: {clickCoords?.latitude.toFixed(6)}, {clickCoords?.longitude.toFixed(6)}</Text>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitReport}
                  >
                    <LinearGradient
                      colors={[palette.accentOrange, '#e65c00']}
                      style={styles.submitGradient}
                    >
                      <Text style={styles.submitBtnText}>Submit to Bhopal Command Center</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reputation Points Overlay */}
      {pointsOverlayVisible && (
        <View style={styles.pointsOverlay}>
          <BlurView intensity={50} tint="dark" style={styles.pointsOverlayBlur}>
            <Text style={styles.overlayTrophy}>🏆</Text>
            <Text style={styles.overlayTitle}>Points Earned!</Text>
            <Text style={styles.overlayAmount}>+{earnedPointsAmount}</Text>
            <Text style={styles.overlayDesc}>Bhopal City Reputation Increased</Text>
          </BlurView>
        </View>
      )}

    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  webView: {
    flex: 1,
  },
  topBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
  },
  topBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6F00',
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtnEmoji: {
    fontSize: 16,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pointsEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  pointsText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: height * 0.15,
    zIndex: 10,
    gap: 12,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  circleBlur: {
    flex: 1,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlIcon: {
    fontSize: 20,
  },
  detailOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 120,
    left: 20,
    right: 20,
    zIndex: 15,
  },
  detailCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    overflow: 'hidden',
    maxHeight: height * 0.6,
  },
  cardIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 15, 8, 0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoryBadge: {
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  departmentName: {
    fontSize: 13,
    marginTop: 2,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  bgHigh: { backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: '#ef4444' },
  bgMedium: { backgroundColor: 'rgba(249, 115, 22, 0.2)', borderWidth: 1, borderColor: '#f97316' },
  bgLow: { backgroundColor: 'rgba(234, 179, 8, 0.2)', borderWidth: 1, borderColor: '#eab308' },
  severityText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginBottom: 16,
  },
  reportDesc: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 12,
  },
  actionButtons: {
    gap: 12,
  },
  verifyButton: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  verifiedButtonDisabled: {
    opacity: 0.6,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 50,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabBtn: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(255, 111, 0, 0.4)',
    elevation: 8,
  },
  fabGradient: {
    paddingHorizontal: 28,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  fabText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  fabHint: {
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  modalBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    height: height * 0.85,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalCloseIcon: {
    fontSize: 18,
    padding: 4,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  cameraBox: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  cameraLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cameraSubtext: {
    fontSize: 11,
    marginTop: 4,
  },
  cameraPreviewContainer: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  retakeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 15, 8, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  retakeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  messageInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    height: 100,
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 12,
    outlineStyle: 'none',
  } as any,
  voiceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  voiceBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  voiceBtnActive: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  voiceIcon: {
    fontSize: 13,
    fontWeight: '600',
  },
  aiButton: {
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    boxShadow: '0 0 15px rgba(255, 111, 0, 0.3)',
  },
  aiButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  aiResultCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    boxShadow: '0 0 15px rgba(255, 111, 0, 0.15)',
  },
  aiResultHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiFieldRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  aiFieldLabel: {
    width: 100,
    fontSize: 13,
    fontWeight: '600',
  },
  aiFieldValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  aiResultDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 12,
  },
  locationTag: {
    fontSize: 11,
    marginBottom: 20,
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 0 15px rgba(255, 111, 0, 0.4)',
  },
  submitGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  pointsOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 15, 8, 0.4)',
  },
  pointsOverlayBlur: {
    width: 240,
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  overlayTrophy: {
    fontSize: 48,
    marginBottom: 12,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  overlayAmount: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FF6F00',
    marginBottom: 8,
  },
  overlayDesc: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
