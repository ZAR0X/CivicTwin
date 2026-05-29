import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView, BlurTargetView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';

// Reusable Glassmorphic container helper matching web backdrop filters
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
      <View style={[style, { backdropFilter: `blur(${intensity / 2}px) saturate(180%)`, WebkitBackdropFilter: `blur(${intensity / 2}px) saturate(180%)` }]}>
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

export default function SettingsScreen() {
  const { 
    theme, 
    toggleTheme, 
    userName, 
    setUserName, 
    profilePhoto, 
    setProfilePhoto,
    userPoints,
    userRank,
    logout
  } = useApp();

  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';
  const backgroundRef = React.useRef<View>(null);

  const [inputName, setInputName] = useState(userName);
  const [photoUrl, setPhotoUrl] = useState(profilePhoto);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);

  const colors = {
    bg: isDark ? '#000F08' : '#F4FFFE',
    bgGradient: isDark ? ['#000F08', '#01120a', '#000000'] : ['#F4FFFE', '#e6fcf9', '#ffffff'],
    text: isDark ? '#ffffff' : '#000F08',
    textSecondary: isDark ? '#92E5EC' : '#64748b',
    cardBg: isDark ? 'rgba(0, 15, 8, 0.72)' : 'rgba(255, 255, 255, 0.75)',
    cardBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    inputBg: isDark ? 'rgba(146, 229, 236, 0.05)' : 'rgba(0, 15, 8, 0.03)',
    inputBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    accentOrange: '#FF6F00',
    electricAqua: '#92E5EC',
    danger: '#ef4444'
  };

  const handleSaveName = () => {
    if (inputName.trim()) {
      setUserName(inputName.trim());
      alert('Profile name updated successfully!');
    }
  };

  const handleSavePhoto = () => {
    if (photoUrl.trim()) {
      setProfilePhoto(photoUrl.trim());
      setIsEditingPhoto(false);
      alert('Profile photo updated successfully!');
    }
  };

  // Mock avatar options for easy user choice
  const MOCK_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', // Women
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200', // Men
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', // Women 2
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', // Men 2
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', // Women 3
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <BlurTargetView ref={backgroundRef} style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={colors.bgGradient as any}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Background radial glow */}
        <View pointerEvents="none" style={[styles.glowBlob, { backgroundColor: colors.electricAqua }]} />
      </BlurTargetView>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.backArrow}>
              <Feather name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
          </View>
          <Text style={[styles.subtitle, { color: colors.textSecondary, marginLeft: 36 }]}>
            Configure your CivicTwin command profile
          </Text>
        </View>

        {/* Profile Details Card */}
        <GlassContainer
          intensity={isDark ? 20 : 40}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.settingsCard, { borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
          blurTarget={backgroundRef}
        >
          <View style={styles.profileSection}>
            <View style={styles.photoContainer}>
              <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
              <TouchableOpacity 
                style={[styles.editPhotoIconBtn, { backgroundColor: colors.accentOrange }]}
                onPress={() => setIsEditingPhoto(!isEditingPhoto)}
              >
                <Feather name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.profilePointsText, { color: colors.text }]}>
              🏆 {userPoints} PTS · Level {userRank} Citizen
            </Text>
          </View>

          {/* Photo Editing URL Input / Presets */}
          {isEditingPhoto && (
            <View style={styles.photoEditSection}>
              <Text style={[styles.label, { color: colors.text }]}>Custom Avatar Image URL</Text>
              <View style={styles.photoUrlRow}>
                <TextInput
                  style={[styles.urlInput, { 
                    backgroundColor: colors.inputBg, 
                    borderColor: colors.inputBorder,
                    color: colors.text 
                  }]}
                  value={photoUrl}
                  onChangeText={setPhotoUrl}
                  placeholder="https://example.com/photo.jpg"
                  placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                />
                <TouchableOpacity 
                  style={[styles.saveBtnSmall, { backgroundColor: colors.accentOrange }]}
                  onPress={handleSavePhoto}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.label, { color: colors.text, marginTop: 14 }]}>Or Choose Preset Avatar</Text>
              <View style={styles.presetRow}>
                {MOCK_AVATARS.map((avatar, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    onPress={() => {
                      setPhotoUrl(avatar);
                      setProfilePhoto(avatar);
                      setIsEditingPhoto(false);
                    }}
                  >
                    <Image 
                      source={{ uri: avatar }} 
                      style={[
                        styles.presetPhoto, 
                        profilePhoto === avatar && { borderColor: colors.accentOrange, borderWidth: 2 }
                      ]} 
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Edit Name Section */}
          <View style={styles.settingsSection}>
            <Text style={[styles.label, { color: colors.text }]}>Whistleblower Profile Name</Text>
            <View style={styles.nameEditRow}>
              <TextInput
                style={[styles.nameInput, { 
                  backgroundColor: colors.inputBg, 
                  borderColor: colors.inputBorder,
                  color: colors.text 
                }]}
                value={inputName}
                onChangeText={setInputName}
                placeholder="Enter name..."
                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
              />
              <TouchableOpacity 
                style={[styles.saveBtnSmall, { backgroundColor: colors.accentOrange }]}
                onPress={handleSaveName}
              >
                <Text style={styles.saveBtnText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassContainer>

        {/* Preferences Settings Card */}
        <Text style={[styles.sectionHeading, { color: colors.text }]}>App Settings</Text>
        <GlassContainer
          intensity={isDark ? 20 : 40}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.settingsCard, { borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
          blurTarget={backgroundRef}
        >
          {/* Theme Option */}
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <View style={[styles.optionIconContainer, { backgroundColor: isDark ? 'rgba(255, 111, 0, 0.1)' : 'rgba(255, 111, 0, 0.05)' }]}>
                <Feather name={isDark ? "moon" : "sun"} size={18} color={colors.accentOrange} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Dark Theme</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                  Enables neon styling and maps high-contrast layers
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.toggleSwitch, { 
                backgroundColor: isDark ? colors.accentOrange : '#cbd5e1',
                alignItems: isDark ? 'flex-end' : 'flex-start'
              }]} 
              onPress={toggleTheme}
            >
              <View style={styles.toggleThumb} />
            </TouchableOpacity>
          </View>

          {/* Privacy Level Info */}
          <View style={styles.optionRow}>
            <View style={styles.optionInfo}>
              <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Feather name="shield" size={18} color="#10b981" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Whistleblower Privacy: Locked</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary, flexWrap: 'wrap' }]}>
                  Your exact identity remains masked. Only super administrators can audit report metadata.
                </Text>
              </View>
            </View>
          </View>

          {/* Logout Option */}
          <View style={[styles.optionRow, { borderBottomWidth: 0, paddingBottom: 0 }]}>
            <View style={styles.optionInfo}>
              <View style={[styles.optionIconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Feather name="log-out" size={18} color={colors.danger} />
              </View>
              <View>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Sign Out</Text>
                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                  Logout from this session
                </Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.saveBtnSmall, { backgroundColor: colors.danger }]} 
              onPress={() => {
                logout();
                router.replace('/');
              }}
            >
              <Text style={styles.saveBtnText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </GlassContainer>

        {/* Info Card */}
        <View style={styles.aboutContainer}>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>CivicTwin Bhopal Prototype · Version 1.0.2</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>Built for Bhopal Municipal Administration Command Center</Text>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  glowBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.08,
    top: '10%',
    right: '-10%',
    filter: Platform.OS === 'web' ? 'blur(90px)' : undefined,
  },
  header: {
    marginBottom: 24,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backArrow: {
    padding: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      } as any,
    }),
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  editPhotoIconBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000F08',
  },
  profilePointsText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 18,
    width: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  nameEditRow: {
    flexDirection: 'row',
    gap: 10,
  },
  nameInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    outlineStyle: 'none',
  } as any,
  photoEditSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 18,
    marginBottom: 18,
    width: '100%',
  },
  photoUrlRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  urlInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 12,
    outlineStyle: 'none',
  } as any,
  saveBtnSmall: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  presetPhoto: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  optionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  optionDesc: {
    fontSize: 11.5,
    marginTop: 2,
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 3,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  aboutContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 6,
  },
  aboutText: {
    fontSize: 11,
    textAlign: 'center',
  },
});
