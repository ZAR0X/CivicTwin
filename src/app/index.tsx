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
  const { reports, userPoints, addReport, verifyReport } = useApp();
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

    // Mock 3 seconds delay for Gemini AI analysis
    setTimeout(() => {
      setAiLoading(false);
      setAiAnalysisComplete(true);

      // Randomly select issue categories depending on input text keywords
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
        // Default Roads
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

    // Add report to context
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
    
    // Close detail popup
    setSelectedReport(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Map Rendering Container */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            ref={iframeRef}
            srcDoc={mapHtml}
            style={{ border: 'none', width: '100%', height: '100%' }}
            onLoad={() => {
              // Listen to messages from standard iframe postMessage
              const listener = (event: any) => {
                try {
                  const data = JSON.parse(event.data);
                  handleMessage(data);
                } catch (e) {}
              };
              window.addEventListener('message', listener);
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
            style={styles.webView}
          />
        )}
      </View>

      {/* Top Floating Branding Bar */}
      <SafeAreaView style={styles.topBar}>
        <View style={styles.topBarRow}>
          <BlurView intensity={30} tint="dark" style={styles.brandBadge}>
            <Text style={styles.brandTitle}>CivicTwin</Text>
            <View style={styles.statusPulse} />
          </BlurView>

          <BlurView intensity={30} tint="dark" style={styles.pointsBadge}>
            <Text style={styles.pointsEmoji}>🏆</Text>
            <Text style={styles.pointsText}>{userPoints} pts</Text>
          </BlurView>
        </View>
      </SafeAreaView>

      {/* Floating Toggle Buttons (Satellite / 3D) */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.circleBtn} onPress={handleToggleMapMode} activeOpacity={0.8}>
          <BlurView intensity={45} tint="dark" style={styles.circleBlur}>
            <Text style={styles.controlIcon}>{mapMode === '3d' ? '📡' : '🏙️'}</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Floating Bottom Sheet Report Details view */}
      {selectedReport && (
        <View style={styles.detailOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.detailCard}>
            <View style={styles.cardIndicator} />
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.categoryBadge}>{selectedReport.category}</Text>
                  <Text style={styles.departmentName}>{selectedReport.department}</Text>
                </View>
                <View style={[
                  styles.severityBadge,
                  selectedReport.severity >= 8 ? styles.bgHigh : selectedReport.severity >= 5 ? styles.bgMedium : styles.bgLow
                ]}>
                  <Text style={styles.severityText}>Severity: {selectedReport.severity}/10</Text>
                </View>
              </View>

              <Image source={{ uri: selectedReport.image }} style={styles.detailImage} />

              <Text style={styles.reportDesc}>{selectedReport.description}</Text>

              <View style={styles.metadataRow}>
                <Text style={styles.metaLabel}>Status: <Text style={styles.metaVal}>{selectedReport.status}</Text></Text>
                <Text style={styles.metaLabel}>Date: <Text style={styles.metaVal}>{selectedReport.date}</Text></Text>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.verifyButton, selectedReport.verifiedByUser && styles.verifiedButtonDisabled]}
                  onPress={handleVerify}
                  disabled={selectedReport.verifiedByUser}
                >
                  <LinearGradient
                    colors={selectedReport.verifiedByUser ? ['#475569', '#334155'] : ['#10b981', '#059669']}
                    style={styles.actionGradient}
                  >
                    <Text style={styles.actionBtnText}>
                      {selectedReport.verifiedByUser ? '✓ Verified' : '👍 I See This Too (+50 pts)'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedReport(null)}>
                  <Text style={styles.closeBtnText}>Dismiss</Text>
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
            // Pick a default coordinate in MP Nagar if they just press FAB
            setClickCoords({ latitude: 23.2324, longitude: 77.4262 });
            setIsReportModalVisible(true);
            resetReportFlow();
          }}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.fabGradient}
          >
            <Text style={styles.fabText}>🚨 Report Issue</Text>
          </LinearGradient>
        </TouchableOpacity>
        <Text style={styles.fabHint}>Tap map to select location, or press here</Text>
      </View>

      {/* Report Creation Modal */}
      <Modal
        visible={isReportModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFillObject} />
          
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>File Civic Grievance</Text>
              <TouchableOpacity onPress={() => setIsReportModalVisible(false)}>
                <Text style={styles.modalCloseIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
              
              {/* Step 1: Media Capture View */}
              <Text style={styles.formLabel}>Step 1: Capture Photo Evidence</Text>
              {!cameraCaptured ? (
                <TouchableOpacity style={styles.cameraBox} onPress={handleCapturePhoto}>
                  <Text style={styles.cameraIcon}>📸</Text>
                  <Text style={styles.cameraLabel}>Tap to Snap Photo</Text>
                  <Text style={styles.cameraSubtext}>Simulate native device camera capture</Text>
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
              <Text style={styles.formLabel}>Step 2: Add Context (Optional)</Text>
              <TextInput
                style={styles.messageInput}
                placeholder="Describe what you see..."
                placeholderTextColor="#64748b"
                multiline={true}
                value={typedMessage}
                onChangeText={setTypedMessage}
              />

              <View style={styles.voiceRow}>
                <TouchableOpacity
                  style={[styles.voiceBtn, voiceActive && styles.voiceBtnActive]}
                  onPress={handleVoiceInput}
                >
                  <Text style={styles.voiceIcon}>{voiceActive ? '🎙️ Listening...' : '🎤 Simulate Voice Note'}</Text>
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
                    colors={['#6366f1', '#4f46e5']}
                    style={styles.aiButtonGradient}
                  >
                    {aiLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.aiButtonText}>🪄 Auto-Analyze with Gemini AI</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Step 4: AI Analysis Results Card */}
              {aiAnalysisComplete && mockedAiResult && (
                <View style={styles.aiResultCard}>
                  <Text style={styles.aiResultHeader}>✦ CivicTwin AI Diagnostics</Text>
                  
                  <View style={styles.aiFieldRow}>
                    <Text style={styles.aiFieldLabel}>Category:</Text>
                    <Text style={styles.aiFieldValue}>{mockedAiResult.category}</Text>
                  </View>

                  <View style={styles.aiFieldRow}>
                    <Text style={styles.aiFieldLabel}>Severity:</Text>
                    <Text style={[styles.aiFieldValue, { color: '#ef4444', fontWeight: 'bold' }]}>
                      {mockedAiResult.severity}/10
                    </Text>
                  </View>

                  <View style={styles.aiFieldRow}>
                    <Text style={styles.aiFieldLabel}>Department:</Text>
                    <Text style={styles.aiFieldValue}>{mockedAiResult.department}</Text>
                  </View>

                  <Text style={styles.aiResultDesc}>{mockedAiResult.description}</Text>
                  
                  <Text style={styles.locationTag}>📍 GPS: {clickCoords?.latitude.toFixed(6)}, {clickCoords?.longitude.toFixed(6)}</Text>

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitReport}
                  >
                    <LinearGradient
                      colors={['#10b981', '#059669']}
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
    backgroundColor: '#0b0f19',
  },
  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  webView: {
    flex: 1,
    backgroundColor: '#0b0f19',
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  brandTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  statusPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  pointsEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  pointsText: {
    color: '#ffffff',
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
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  circleBlur: {
    flex: 1,
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
    borderColor: 'rgba(255, 255, 255, 0.15)',
    overflow: 'hidden',
    maxHeight: height * 0.6,
  },
  cardIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  departmentName: {
    color: '#94a3b8',
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
    color: '#f8fafc',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 12,
    marginBottom: 20,
  },
  metaLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  metaVal: {
    color: '#cbd5e1',
    fontWeight: '600',
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
    borderColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#cbd5e1',
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
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
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
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  modalBg: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    height: height * 0.85,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#ffffff',
  },
  modalCloseIcon: {
    fontSize: 18,
    color: '#64748b',
    padding: 4,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  cameraBox: {
    height: 180,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.15)',
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
    color: '#ffffff',
  },
  cameraSubtext: {
    fontSize: 11,
    color: '#64748b',
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
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  retakeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  messageInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    height: 100,
    color: '#ffffff',
    fontSize: 15,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  voiceRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
  voiceBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
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
    color: '#cbd5e1',
    fontWeight: '600',
  },
  aiButton: {
    height: 52,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
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
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.25)',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  aiResultHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#818cf8',
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
    color: '#64748b',
    fontWeight: '600',
  },
  aiFieldValue: {
    flex: 1,
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  aiResultDesc: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 10,
    marginBottom: 12,
  },
  locationTag: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 20,
  },
  submitButton: {
    height: 50,
    borderRadius: 12,
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
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#10b981',
    marginBottom: 8,
  },
  overlayDesc: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
