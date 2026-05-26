import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  FlatList,
  Platform,
  Image,
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
  const { userPoints, userRank } = useApp();
  const insets = useSafeAreaInsets();

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

  const renderLeaderboardItem = ({ item }: { item: Contributor }) => {
    return (
      <View style={[
        styles.listRow,
        item.isCurrentUser && styles.currentUserRow
      ]}>
        <View style={styles.rankContainer}>
          {item.rank === 1 ? (
            <Text style={styles.goldMedal}>🥇</Text>
          ) : item.rank === 2 ? (
            <Text style={styles.silverMedal}>🥈</Text>
          ) : item.rank === 3 ? (
            <Text style={styles.bronzeMedal}>🥉</Text>
          ) : (
            <Text style={styles.rankText}>#{item.rank}</Text>
          )}
        </View>

        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </Text>
        </View>

        <View style={styles.nameContainer}>
          <Text style={[styles.userName, item.isCurrentUser && styles.currentUserText]}>
            {item.name}
          </Text>
          <Text style={styles.reportsStat}>{item.reportsCount} Reports Submitted</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreValue}>{item.points}</Text>
          <Text style={styles.scoreLabel}>PTS</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#020617']}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Background radial glow */}
      <View style={styles.glowBlob} />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 80 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Bhopal Civic Pride</Text>
          <Text style={styles.subtitle}>Leaderboard of Active Whistleblowers</Text>
        </View>

        {/* User Card - Glassmorphism */}
        <View style={styles.userCardContainer}>
          <BlurView intensity={25} tint="dark" style={styles.blurCard}>
            <LinearGradient
              colors={['rgba(16, 185, 129, 0.1)', 'rgba(99, 102, 241, 0.05)']}
              style={StyleSheet.absoluteFillObject}
            />
            
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Your Rep Scorecard</Text>
              <Text style={styles.cardLevel}>Level 2: Active Citizen</Text>
            </View>

            <View style={styles.cardStatsRow}>
              <View style={styles.cardStatCol}>
                <Text style={styles.statNumber}>#{rankedLeaderboard.findIndex(i => i.isCurrentUser) + 1}</Text>
                <Text style={styles.statLabel}>Bhopal Rank</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardStatCol}>
                <Text style={styles.statNumber}>{userPoints}</Text>
                <Text style={styles.statLabel}>Total Points</Text>
              </View>
              <View style={styles.cardDivider} />
              <View style={styles.cardStatCol}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Submissions</Text>
              </View>
            </View>

            <Text style={styles.pointsPrompt}>
              💡 Submit 2 more verified reports to level up and gain double point multipliers!
            </Text>
          </BlurView>
        </View>

        {/* Leaderboard Heading */}
        <Text style={styles.listHeading}>City Contributors</Text>

        {/* Leaderboard Table List */}
        <View style={styles.leaderboardList}>
          {rankedLeaderboard.map((item) => (
            <React.Fragment key={item.name}>
              {renderLeaderboardItem({ item })}
            </React.Fragment>
          ))}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  glowBlob: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#6366f1',
    opacity: 0.08,
    top: '10%',
    right: '-10%',
    filter: Platform.OS === 'web' ? 'blur(80px)' : undefined,
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  userCardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  cardLevel: {
    color: '#10b981',
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
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  cardDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pointsPrompt: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  listHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  leaderboardList: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  currentUserRow: {
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  rankContainer: {
    width: 32,
    alignItems: 'flex-start',
  },
  goldMedal: { fontSize: 20 },
  silverMedal: { fontSize: 20 },
  bronzeMedal: { fontSize: 20 },
  rankText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 14,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: 'bold',
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    color: '#e2e8f0',
    fontSize: 14,
    fontWeight: '600',
  },
  currentUserText: {
    color: '#10b981',
    fontWeight: 'bold',
  },
  reportsStat: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreLabel: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },
});
