import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
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
    textSecondary: isDark ? '#92E5EC' : '#475569',
    cardBg: isDark ? 'rgba(0, 15, 8, 0.75)' : 'rgba(244, 255, 254, 0.85)',
    cardBorder: isDark ? 'rgba(146, 229, 236, 0.15)' : 'rgba(0, 15, 8, 0.08)',
    rowBg: isDark ? 'rgba(146, 229, 236, 0.03)' : 'rgba(0, 15, 8, 0.03)',
    rowBorder: isDark ? 'rgba(146, 229, 236, 0.08)' : 'rgba(0, 15, 8, 0.05)',
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
    return (
      <View 
        key={item.name}
        style={[
          styles.listRow,
          { 
            backgroundColor: item.isCurrentUser ? 'rgba(255, 111, 0, 0.06)' : palette.rowBg, 
            borderColor: item.isCurrentUser ? palette.accentOrange : palette.rowBorder 
          }
        ]}
      >
        <View style={styles.rankContainer}>
          {item.rank === 1 ? (
            <Text style={styles.goldMedal}>🥇</Text>
          ) : item.rank === 2 ? (
            <Text style={styles.silverMedal}>🥈</Text>
          ) : item.rank === 3 ? (
            <Text style={styles.bronzeMedal}>🥉</Text>
          ) : (
            <Text style={[styles.rankText, { color: palette.textSecondary }]}>#{item.rank}</Text>
          )}
        </View>

        <View style={[styles.avatarContainer, { backgroundColor: isDark ? 'rgba(146, 229, 236, 0.1)' : 'rgba(0, 15, 8, 0.05)' }]}>
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
        colors={palette.bgGradient}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Background radial glow */}
      <View style={[styles.glowBlob, { backgroundColor: palette.electricAqua }]} />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: palette.text }]}>Bhopal Civic Pride</Text>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>Leaderboard of Active Whistleblowers</Text>
        </View>

        {/* User Card - Glassmorphism */}
        <View style={[styles.userCardContainer, { borderColor: palette.cardBorder }]}>
          <BlurView intensity={isDark ? 20 : 40} tint={isDark ? 'dark' : 'light'} style={styles.blurCard}>
            <LinearGradient
              colors={isDark ? ['rgba(255, 111, 0, 0.1)', 'rgba(146, 229, 236, 0.05)'] : ['rgba(255, 111, 0, 0.05)', 'rgba(146, 229, 236, 0.03)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: palette.text }]}>Your Rep Scorecard</Text>
              <Text style={[styles.cardLevel, { color: palette.accentOrange }]}>Level 2: Active Citizen</Text>
            </View>

            <View style={styles.cardStatsRow}>
              <View style={styles.cardStatCol}>
                <Text style={[styles.statNumber, { color: palette.text }]}>
                  #{rankedLeaderboard.findIndex(i => i.isCurrentUser) + 1}
                </Text>
                <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Bhopal Rank</Text>
              </View>
              <View style={[styles.cardDivider, { backgroundColor: palette.cardBorder }]} />
              <View style={styles.cardStatCol}>
                <Text style={[styles.statNumber, { color: palette.text }]}>{userPoints}</Text>
                <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Total Points</Text>
              </View>
              <View style={[styles.cardDivider, { backgroundColor: palette.cardBorder }]} />
              <View style={styles.cardStatCol}>
                <Text style={[styles.statNumber, { color: palette.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: palette.textSecondary }]}>Submissions</Text>
              </View>
            </View>

            <Text style={[styles.pointsPrompt, { color: palette.text, backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }]}>
              💡 Submit 2 more verified reports to level up and gain double point multipliers!
            </Text>
          </BlurView>
        </View>

        {/* Leaderboard Heading */}
        <Text style={[styles.listHeading, { color: palette.text }]}>City Contributors</Text>

        {/* Leaderboard Table List */}
        <View style={[styles.leaderboardList, { borderColor: palette.rowBorder }]}>
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
    paddingHorizontal: 20,
  },
  glowBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.1,
    top: '10%',
    right: '-10%',
    filter: Platform.OS === 'web' ? 'blur(95px)' : undefined,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  userCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    marginBottom: 32,
  },
  blurCard: {
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  cardStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardStatCol: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  cardDivider: {
    width: 1,
    height: 32,
  },
  pointsPrompt: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  listHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardList: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  rankContainer: {
    width: 32,
    alignItems: 'flex-start',
  },
  goldMedal: { fontSize: 20 },
  silverMedal: { fontSize: 20 },
  bronzeMedal: { fontSize: 20 },
  rankText: {
    fontWeight: '600',
    fontSize: 14,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 9,
    marginTop: 1,
  },
});
