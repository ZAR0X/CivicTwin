import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '@/context/AppContext';

interface Contributor {
  rank: number;
  name: string;
  points: number;
  reportsCount: number;
  isCurrentUser?: boolean;
}

export default function LeaderboardScreen() {
  const { userPoints, theme } = useApp();
  const insets = useSafeAreaInsets();

  const isDark = theme === 'dark';

  const palette = {
    bg: isDark ? '#000F08' : '#F4FFFE',
    bgGradient: isDark ? ['#000F08', '#01120a', '#000000'] : ['#F4FFFE', '#e6fcf9', '#ffffff'],
    text: isDark ? '#ffffff' : '#000F08',
    textSecondary: isDark ? '#92E5EC' : '#64748b',
    cardBg: isDark ? 'rgba(0, 15, 8, 0.72)' : 'rgba(255, 255, 255, 0.75)',
    cardBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    rowBg: isDark ? 'rgba(146, 229, 236, 0.02)' : 'rgba(255, 255, 255, 0.45)',
    rowBorder: isDark ? 'rgba(146, 229, 236, 0.06)' : 'rgba(0, 15, 8, 0.04)',
    accentOrange: '#FF6F00',
    electricAqua: '#92E5EC',
  };

  const MOCK_LEADERBOARD: Contributor[] = [
    { rank: 1, name: 'Ananya Sharma', points: 340, reportsCount: 14 },
    { rank: 2, name: 'You (Bhopal Citizen)', points: userPoints, reportsCount: 5, isCurrentUser: true },
    { rank: 3, name: 'Rajesh Verma', points: 210, reportsCount: 9 },
    { rank: 4, name: 'Amit Gond', points: 180, reportsCount: 7 },
    { rank: 5, name: 'Siddharth Rao', points: 145, reportsCount: 4 },
    { rank: 6, name: 'Kavita Mishra', points: 95, reportsCount: 3 },
    { rank: 7, name: 'Rohan Gupta', points: 80, reportsCount: 2 },
    { rank: 8, name: 'Preeti Patidar', points: 55, reportsCount: 2 },
  ];

  // Sort by points dynamically
  const sortedLeaderboard = [...MOCK_LEADERBOARD].sort((a, b) => b.points - a.points);
  
  // Re-assign ranks based on sorted list
  const rankedLeaderboard = sortedLeaderboard.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const renderLeaderboardItem = (item: Contributor) => {
    // Premium rank badge styles instead of emojis
    const getRankStyle = (rank: number) => {
      if (rank === 1) return { bg: '#FFDF00', text: '#000F08' }; // Gold
      if (rank === 2) return { bg: '#C0C0C0', text: '#000F08' }; // Silver
      if (rank === 3) return { bg: '#CD7F32', text: '#ffffff' }; // Bronze
      return { bg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,15,8,0.04)', text: palette.textSecondary };
    };

    const rankStyle = getRankStyle(item.rank);

    return (
      <View 
        key={item.name}
        style={[
          styles.listRow,
          { 
            backgroundColor: item.isCurrentUser ? 'rgba(255, 111, 0, 0.03)' : palette.rowBg, 
            borderColor: item.isCurrentUser ? palette.accentOrange : palette.rowBorder 
          }
        ]}
      >
        <View style={styles.rankContainer}>
          <View style={[styles.rankBadgeCircle, { backgroundColor: rankStyle.bg }]}>
            <Text style={[styles.rankBadgeText, { color: rankStyle.text }]}>{item.rank}</Text>
          </View>
        </View>

        <View style={[styles.avatarContainer, { backgroundColor: isDark ? 'rgba(146, 229, 236, 0.08)' : 'rgba(0, 15, 8, 0.03)' }]}>
          <Text style={[styles.avatarText, { color: palette.text }]}>
            {item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </Text>
        </View>

        <View style={styles.nameContainer}>
          <Text style={[styles.userName, { color: palette.text }, item.isCurrentUser && { color: palette.accentOrange, fontWeight: 'bold' }]}>
            {item.name}
          </Text>
          <Text style={[styles.reportsStat, { color: palette.textSecondary }]}>{item.reportsCount} Reports Submitted</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreValue, { color: palette.text }]}>{item.points}</Text>
          <Text style={[styles.scoreLabel, { color: palette.textSecondary }]}>PTS</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.bg }]}>
      <LinearGradient
        colors={palette.bgGradient as any}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Background radial glow */}
      <View pointerEvents="none" style={[styles.glowBlob, { backgroundColor: palette.electricAqua }]} />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <TouchableOpacity onPress={() => router.push('/')} style={styles.backArrow}>
              <Feather name="arrow-left" size={24} color={palette.text} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: palette.text }]}>Bhopal Civic Pride</Text>
          </View>
          <Text style={[styles.subtitle, { color: palette.textSecondary, marginLeft: 36 }]}>
            Leaderboard of Active Whistleblowers
          </Text>
        </View>

        {/* User Card - Sleek card styling, no borders, soft drop shadow */}
        <View style={[styles.userCardContainer, { backgroundColor: palette.cardBg, borderColor: palette.cardBorder }]}>
          <View style={styles.cardPadding}>
            
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: palette.text }]}>Your Rep Scorecard</Text>
              <View style={styles.cardLevelBadge}>
                <Text style={styles.cardLevelText}>Level 2 Citizen</Text>
              </View>
            </View>

            <View style={styles.cardStatsRow}>
              <View style={styles.cardStatCol}>
                <View style={styles.iconRow}>
                  <Feather name="map-pin" size={14} color={palette.accentOrange} style={{ marginRight: 4 }} />
                  <Text style={[styles.statNumber, { color: palette.text }]}>
                    #{rankedLeaderboard.findIndex(i => i.isCurrentUser) + 1}
                  </Text>
                </View>
                <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Bhopal Rank</Text>
              </View>
              <View style={[styles.cardDivider, { backgroundColor: palette.cardBorder }]} />
              <View style={styles.cardStatCol}>
                <View style={styles.iconRow}>
                  <Feather name="award" size={14} color={palette.accentOrange} style={{ marginRight: 4 }} />
                  <Text style={[styles.statNumber, { color: palette.text }]}>{userPoints}</Text>
                </View>
                <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Total Points</Text>
              </View>
              <View style={[styles.cardDivider, { backgroundColor: palette.cardBorder }]} />
              <View style={styles.cardStatCol}>
                <View style={styles.iconRow}>
                  <Feather name="file-text" size={14} color={palette.accentOrange} style={{ marginRight: 4 }} />
                  <Text style={[styles.statNumber, { color: palette.text }]}>5</Text>
                </View>
                <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Submissions</Text>
              </View>
            </View>

            <View style={[styles.pointsPrompt, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)' }]}>
              <Feather name="info" size={14} color={palette.accentOrange} style={{ marginRight: 8, marginTop: 2 }} />
              <Text style={[styles.pointsPromptText, { color: palette.text }]}>
                Submit 2 more verified reports to level up and gain double point multipliers!
              </Text>
            </View>
          </View>
        </View>

        {/* Leaderboard Heading */}
        <Text style={[styles.listHeading, { color: palette.text }]}>City Contributors</Text>

        {/* Leaderboard Table List - soft shadows, borderless */}
        <View style={[styles.leaderboardList, { borderColor: palette.rowBorder, backgroundColor: palette.cardBg }]}>
          {rankedLeaderboard.map((item) => renderLeaderboardItem(item))}
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
  userCardContainer: {
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 28,
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
  cardPadding: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardLevelBadge: {
    backgroundColor: 'rgba(255, 111, 0, 0.08)',
    borderRadius: 6,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  cardLevelText: {
    color: '#FF6F00',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 18,
  },
  cardStatCol: {
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  cardDivider: {
    width: 1,
    height: 28,
  },
  pointsPrompt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  pointsPromptText: {
    flex: 1,
    fontSize: 11.5,
    lineHeight: 16,
  },
  listHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 14,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardList: {
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
    ...Platform.select({
      web: {
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      } as any,
    }),
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
  },
  rankContainer: {
    width: 32,
    alignItems: 'flex-start',
  },
  rankBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankBadgeText: {
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  goldMedal: { fontSize: 20 },
  silverMedal: { fontSize: 20 },
  bronzeMedal: { fontSize: 20 },
  rankText: {
    fontWeight: '600',
    fontSize: 13,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 10.5,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  reportsStat: {
    fontSize: 11,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 9,
    marginTop: 1,
  },
});
