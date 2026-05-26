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
import { Feather, Ionicons } from '@expo/vector-icons';
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
  const isDark = theme === 'dark';

  // Palette: Onyx (000F08), Pumpkin Spice (FF6F00), Azure Mist (F4FFFE), Electric Aqua (92E5EC)
  const colors = {
    bg: isDark ? '#000F08' : '#F4FFFE',
    cardBg: isDark ? '#000F08' : '#ffffff',
    text: isDark ? '#ffffff' : '#000F08',
    textSecondary: isDark ? '#92E5EC' : '#64748b',
    border: isDark ? 'rgba(146, 229, 236, 0.1)' : 'rgba(0, 15, 8, 0.05)',
    accent: '#FF6F00',
    electricAqua: '#92E5EC',
    shadow: 'rgba(0, 15, 8, 0.04)',
    accentBg: isDark ? 'rgba(255, 111, 0, 0.1)' : 'rgba(255, 111, 0, 0.05)',
    inputBg: isDark ? 'rgba(146, 229, 236, 0.05)' : 'rgba(0, 15, 8, 0.03)',
    inputBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
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

  const resetReportFlow = () => {
    setTypedMessage('');
    setVoiceActive(false);
    setAiLoading(false);
    setAiAnalysisComplete(false);
    setCameraCaptured(false);
    setMockedAiResult(null);
  };

  const handleCapturePhoto = () => {
    setCameraCaptured(true);
  };

  const handleVoiceInput = () => {
    setVoiceActive(true);
    setTimeout(() => {
      setVoiceActive(false);
      setTypedMessage('Water pipe leakage flooding the main street corner.');
    }, 1800);
  };

  const handleRunAiAnalysis = () => {
    if (!cameraCaptured) return;
    setAiLoading(true);

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
    }, 2000);
  };

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
    setEarnedPointsAmount(25);
    setPointsOverlayVisible(true);
    setTimeout(() => setPointsOverlayVisible(false), 3000);
  };

  const handleVerify = () => {
    if (!selectedReport) return;
    verifyReport(selectedReport.id);
    
    setEarnedPointsAmount(50);
    setPointsOverlayVisible(true);
    setTimeout(() => setPointsOverlayVisible(false), 3000);
    setSelectedReport(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Mapbox iframe/webview */}
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

      {/* Sleek Floating Top Search Bar (Matches Screenshot Widget Layout) */}
      <SafeAreaView style={styles.topOverlay}>
        <View style={styles.topContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <Feather name="search" size={20} color={isDark ? '#92E5EC' : '#94a3b8'} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search reports or tap map..."
              placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              editable={false}
            />
            <TouchableOpacity style={styles.micBtn} onPress={toggleTheme}>
              <Feather name={isDark ? "sun" : "moon"} size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>

          {/* Quick Stats Pill */}
          <View style={styles.statsPillWrapper}>
            <View style={[styles.statsPill, { backgroundColor: 'rgba(0, 15, 8, 0.8)' }]}>
              <View style={styles.pulseIndicator} />
              <Text style={styles.statsPillText}>Bhopal Live Command: {reports.length} Tickets</Text>
              <Text style={styles.pointsPill}>🏆 {userPoints} pts</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {/* Satellite Toggle Controls */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={[styles.circleBtn, { backgroundColor: colors.cardBg, borderColor: colors.border }]} onPress={handleToggleMapMode} activeOpacity={0.85}>
          <Feather name={mapMode === '3d' ? 'globe' : 'map'} size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Sleek Bottom Sheet Details Card (Umami Bam styling) */}
      {selectedReport && (
        <View style={styles.detailOverlay}>
          <View style={[styles.detailCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.cardDragHandle} />
            
            <View style={styles.detailCardHeader}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.detailTitle, { color: colors.text }]}>{selectedReport.category} Issue</Text>
                <Text style={styles.detailAddress}>{selectedReport.department}</Text>
              </View>
              <TouchableOpacity style={styles.bookmarkBtn}>
                <Feather name="bookmark" size={20} color={colors.accent} />
              </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.openBadge}>
                <Text style={styles.openBadgeText}>Severity {selectedReport.severity}/10</Text>
              </View>
              <Text style={[styles.dateText, { color: colors.textSecondary }]}>Reported {selectedReport.date}</Text>
            </View>

            {/* Category info line */}
            <View style={styles.categoryLine}>
              <View style={[styles.categoryCircle, { backgroundColor: colors.accentBg }]}>
                <Feather name="alert-triangle" size={14} color={colors.accent} />
              </View>
              <Text style={[styles.categoryLineText, { color: colors.textSecondary }]}>
                Status: <Text style={{ color: colors.accent, fontWeight: '600' }}>{selectedReport.status}</Text>
              </Text>
            </View>

            {/* Main description text */}
            <Text style={[styles.detailDesc, { color: colors.text }]}>{selectedReport.description}</Text>

            {/* Horizontal Scroll list of images */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagesScroll}>
              <Image source={{ uri: selectedReport.image }} style={styles.scrollImage} />
              <Image source={{ uri: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500' }} style={styles.scrollImage} />
              <Image source={{ uri: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500' }} style={styles.scrollImage} />
            </ScrollView>

            {/* Action buttons */}
            <View style={styles.detailActions}>
              <TouchableOpacity style={[styles.actionBtnOutline, { borderColor: colors.border }]} onPress={() => setSelectedReport(null)}>
                <Text style={[styles.actionTextOutline, { color: colors.text }]}>Dismiss</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionBtnFilled, selectedReport.verifiedByUser && styles.actionBtnDisabled]}
                onPress={handleVerify}
                disabled={selectedReport.verifiedByUser}
              >
                <LinearGradient
                  colors={selectedReport.verifiedByUser ? ['#64748b', '#475569'] : [colors.accent, '#e65c00']}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionTextFilled}>
                    {selectedReport.verifiedByUser ? 'Verified ✓' : 'Verify (+50 pts)'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Floating Action Button (FAB) */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabBtn}
          activeOpacity={0.9}
          onPress={() => {
            setClickCoords({ latitude: 23.2324, longitude: 77.4262 });
            setIsReportModalVisible(true);
            resetReportFlow();
          }}
        >
          <LinearGradient
            colors={[colors.accent, '#d95f00']}
            style={styles.fabGradient}
          >
            <Feather name="camera" size={20} color="#fff" style={styles.fabIcon} />
            <Text style={styles.fabText}>Report Hazard</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Clean Report Modal (emerges from bottom) */}
      <Modal
        visible={isReportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.modalDismissBg} onPress={() => setIsReportModalVisible(false)} />
          
          <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
            <View style={styles.cardDragHandle} />
            
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>New Civic Report</Text>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setIsReportModalVisible(false)}>
                <Feather name="x" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
              
              {/* Media capture box */}
              {!cameraCaptured ? (
                <TouchableOpacity 
                  style={[styles.cameraBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]} 
                  onPress={handleCapturePhoto}
                >
                  <Feather name="camera" size={32} color={colors.accent} style={{ marginBottom: 12 }} />
                  <Text style={[styles.cameraLabel, { color: colors.text }]}>Snap Photo Evidence</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>Tap to open camera viewfinder</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.cameraPreviewContainer}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=500' }}
                    style={styles.cameraPreview}
                  />
                  <TouchableOpacity style={styles.retakeBtn} onPress={() => setCameraCaptured(false)}>
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* TextInput description */}
              <TextInput
                style={[styles.messageInput, { 
                  backgroundColor: colors.inputBg, 
                  borderColor: colors.border,
                  color: colors.text 
                }]}
                placeholder="Describe issue (e.g. water leak, pothole)..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                multiline={true}
                value={typedMessage}
                onChangeText={setTypedMessage}
              />

              <View style={styles.voiceRow}>
                <TouchableOpacity
                  style={[styles.voiceBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }, voiceActive && styles.voiceBtnActive]}
                  onPress={handleVoiceInput}
                >
                  <Text style={[styles.voiceIcon, { color: colors.text }]}>
                    {voiceActive ? '🎙️ Listening...' : '🎤 Simulate Voice'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Gemini AI Trigger Button */}
              {cameraCaptured && !aiAnalysisComplete && (
                <TouchableOpacity
                  style={[styles.aiButton, aiLoading && styles.disabledBtn]}
                  onPress={handleRunAiAnalysis}
                  disabled={aiLoading}
                >
                  <LinearGradient
                    colors={['#6366f1', '#4f46e5']}
                    style={styles.aiButtonGradient}
                  >
                    {aiLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.aiButtonText}>🪄 Gemini AI Analysis</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* AI Diagnostics details card */}
              {aiAnalysisComplete && mockedAiResult && (
                <View style={[styles.aiResultCard, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                  <Text style={[styles.aiResultHeader, { color: colors.accent }]}>✦ Gemini AI Diagnostics</Text>
                  
                  <View style={styles.aiFieldRow}>
                    <Text style={[styles.aiFieldLabel, { color: colors.textSecondary }]}>Category:</Text>
                    <Text style={[styles.aiFieldValue, { color: colors.text }]}>{mockedAiResult.category}</Text>
                  </View>

                  <View style={styles.aiFieldRow}>
                    <Text style={[styles.aiFieldLabel, { color: colors.textSecondary }]}>Severity:</Text>
                    <Text style={[styles.aiFieldValue, { color: '#ef4444', fontWeight: 'bold' }]}>
                      {mockedAiResult.severity}/10
                    </Text>
                  </View>

                  <View style={styles.aiFieldRow}>
                    <Text style={[styles.aiFieldLabel, { color: colors.textSecondary }]}>Department:</Text>
                    <Text style={[styles.aiFieldValue, { color: colors.text }]}>{mockedAiResult.department}</Text>
                  </View>

                  <Text style={[styles.aiResultDesc, { color: colors.text, borderTopColor: colors.border }]}>{mockedAiResult.description}</Text>
                  <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 20 }}>📍 GPS: {clickCoords?.latitude.toFixed(6)}, {clickCoords?.longitude.toFixed(6)}</Text>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitReport}
                  >
                    <LinearGradient
                      colors={[colors.accent, '#d95f00']}
                      style={styles.submitGradient}
                    >
                      <Text style={styles.submitBtnText}>Submit Report (+25 PTS)</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}

            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Points overlay card */}
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
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  webView: {
    flex: 1,
  },
  topOverlay: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 0 : 10,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
  },
  topContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    height: 54,
    paddingHorizontal: 16,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    height: '100%',
    outlineStyle: 'none',
  } as any,
  micBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsPillWrapper: {
    alignItems: 'center',
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 8,
  },
  pulseIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF6F00',
  },
  statsPillText: {
    color: '#ffffff',
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  pointsPill: {
    color: '#92E5EC',
    fontSize: 11.5,
    fontWeight: 'bold',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.2)',
    paddingLeft: 8,
  },
  mapControls: {
    position: 'absolute',
    right: 16,
    top: height * 0.18,
    zIndex: 10,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  detailOverlay: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 90 : 100,
    left: 0,
    right: 0,
    zIndex: 15,
    paddingHorizontal: 16,
  },
  detailCard: {
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 6,
    maxHeight: height * 0.58,
  },
  cardDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 15, 8, 0.1)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  detailCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  detailAddress: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  bookmarkBtn: {
    padding: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  openBadge: {
    backgroundColor: 'rgba(255, 111, 0, 0.08)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  openBadgeText: {
    color: '#FF6F00',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  dateText: {
    fontSize: 12,
  },
  categoryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  categoryCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLineText: {
    fontSize: 13,
  },
  detailDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  imagesScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  scrollImage: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 10,
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtnOutline: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextOutline: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionBtnFilled: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  actionBtnDisabled: {
    opacity: 0.6,
  },
  actionGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextFilled: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  fabContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 40,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  fabBtn: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FF6F00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  fabGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: '100%',
    gap: 8,
  },
  fabIcon: {
    marginTop: -1,
  },
  fabText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalBg: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 15, 8, 0.4)',
  },
  modalDismissBg: {
    ...StyleSheet.absoluteFill,
  },
  modalContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    height: height * 0.82,
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: 'bold',
  },
  modalCloseBtn: {
    padding: 4,
  },
  cameraBox: {
    height: 160,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cameraLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  cameraPreviewContainer: {
    height: 160,
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 15, 8, 0.75)',
  },
  retakeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  messageInput: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    height: 90,
    fontSize: 14.5,
    textAlignVertical: 'top',
    marginBottom: 12,
    outlineStyle: 'none',
  } as any,
  voiceRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  voiceBtn: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  voiceBtnActive: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  voiceIcon: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  aiButton: {
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  aiButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  aiResultCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
    marginTop: 10,
  },
  aiResultHeader: {
    fontSize: 14.5,
    fontWeight: 'bold',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiFieldRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  aiFieldLabel: {
    width: 90,
    fontSize: 12.5,
    fontWeight: '600',
  },
  aiFieldValue: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
  },
  aiResultDesc: {
    fontSize: 13.5,
    lineHeight: 18,
    marginTop: 8,
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 12,
  },
  submitButton: {
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
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
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 15, 8, 0.4)',
  },
  pointsOverlayBlur: {
    width: 200,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    alignItems: 'center',
  },
  overlayTrophy: {
    fontSize: 40,
    marginBottom: 10,
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  overlayAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FF6F00',
    marginBottom: 6,
  },
  overlayDesc: {
    fontSize: 10.5,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
