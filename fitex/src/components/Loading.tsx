import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  type?: 'default' | 'skeleton' | 'workout' | 'sync';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Загрузка...',
  showProgress = false,
  progress = 0,
  type = 'default',
}) => {
  const spinValue = new Animated.Value(0);
  const pulseValue = new Animated.Value(1);

  React.useEffect(() => {
    if (type === 'default') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else if (type === 'sync') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [type]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = pulseValue;

  const renderDefaultLoader = () => (
    <View style={styles.centerContent}>
      <Animated.View style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}>
        <Text style={styles.logo}>💪</Text>
      </Animated.View>
      <Text style={styles.message}>{message}</Text>
      {showProgress && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      )}
    </View>
  );

  const renderSkeletonLoader = () => (
    <View style={styles.skeletonContainer}>
      <View style={styles.skeletonHeader} />
      {[1, 2, 3, 4].map((item) => (
        <View key={item} style={styles.skeletonItem}>
          <View style={styles.skeletonLine} />
          <View style={[styles.skeletonLine, { width: '70%' }]} />
          <View style={[styles.skeletonLine, { width: '50%' }]} />
        </View>
      ))}
    </View>
  );

  const renderWorkoutLoader = () => (
    <View style={styles.centerContent}>
      <Animated.View style={[styles.workoutIcon, { transform: [{ scale }] }]}>
        <Text style={styles.workoutEmoji}>🏋️‍♂️</Text>
      </Animated.View>
      <Text style={styles.workoutMessage}>Подготовка тренировки...</Text>
      <Text style={styles.workoutSubMessage}>Загружаем упражнения</Text>
    </View>
  );

  const renderSyncLoader = () => (
    <View style={styles.centerContent}>
      <Animated.View style={[styles.syncIcon, { transform: [{ scale }] }]}>
        <Text style={styles.syncEmoji}>🔄</Text>
      </Animated.View>
      <Text style={styles.syncMessage}>Синхронизация данных</Text>
      <View style={styles.syncDetails}>
        <Text style={styles.syncDetail}>Подключение к серверу...</Text>
        {showProgress && (
          <>
            <View style={styles.syncProgressBar}>
              <View style={[styles.syncProgressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.syncProgressText}>
              {progress < 100 ? 'Синхронизация...' : 'Завершено!'}
            </Text>
          </>
        )}
      </View>
    </View>
  );

  const renderLoader = () => {
    switch (type) {
      case 'skeleton':
        return renderSkeletonLoader();
      case 'workout':
        return renderWorkoutLoader();
      case 'sync':
        return renderSyncLoader();
      default:
        return renderDefaultLoader();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderLoader()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 40,
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  progressContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  // Skeleton styles
  skeletonContainer: {
    flex: 1,
    padding: 20,
  },
  skeletonHeader: {
    width: '60%',
    height: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 30,
  },
  skeletonItem: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonLine: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    width: '100%',
  },
  // Workout loader styles
  workoutIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  workoutEmoji: {
    fontSize: 50,
  },
  workoutMessage: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  workoutSubMessage: {
    fontSize: 16,
    color: '#666',
  },
  // Sync loader styles
  syncIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C75920',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  syncEmoji: {
    fontSize: 40,
  },
  syncMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  syncDetails: {
    alignItems: 'center',
    width: '80%',
  },
  syncDetail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  syncProgressBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  syncProgressFill: {
    height: '100%',
    backgroundColor: '#34C759',
    borderRadius: 3,
  },
  syncProgressText: {
    fontSize: 14,
    color: '#666',
  },
});

export default LoadingScreen;