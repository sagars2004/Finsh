import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { Footer } from '../shared/Footer';
import { TradeoffCard } from './TradeoffCard';
import { getPlaceholderTradeoffs } from '../../utils/placeholders';
import { generateTradeoffs } from '../../services/replit/ai';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import { TradeoffCard as TradeoffCardType } from '../../types/tradeoff';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const SWIPE_THRESHOLD = 50;

interface TradeoffCardsScreenProps {
  onBack: () => void;
  navigation?: any;
}

export function TradeoffCardsScreen({ onBack, navigation }: TradeoffCardsScreenProps) {
  const { userData } = useUser();
  const { currentColors } = useTheme();
  const [cards, setCards] = useState<TradeoffCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadTradeoffs() {
      if (userData) {
        try {
          const tradeoffs = await generateTradeoffs(userData);
          setCards(tradeoffs);
        } catch (error) {
          console.error('Error loading tradeoffs:', error);
          // Fallback to placeholder data
          setCards(getPlaceholderTradeoffs());
        }
      } else {
        // Use placeholder data if no user data
        setCards(getPlaceholderTradeoffs());
      }
      setLoading(false);
    }
    loadTradeoffs();
  }, [userData]);

  // Reset translateX when index changes
  useEffect(() => {
    translateX.setValue(0);
  }, [currentIndex, translateX]);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;
      const swipeThreshold = Math.abs(translationX) > SWIPE_THRESHOLD || Math.abs(velocityX) > 500;

      if (swipeThreshold) {
        if (translationX > 0 && currentIndex > 0) {
          // Swipe right - go to previous
          handlePrevious();
        } else if (translationX < 0 && currentIndex < cards.length - 1) {
          // Swipe left - go to next
          handleNext();
        }
      }

      // Reset position
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  };

  const cardStyle = {
    transform: [{ translateX }],
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: currentColors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: currentColors.borderLight,
    },
    backButton: {
      padding: spacing.sm,
    },
    backButtonText: {
      ...typography.body,
      color: currentColors.text,
      fontWeight: '700',
    },
    counter: {
      ...typography.bodySmall,
      color: currentColors.textSecondary,
    },
    gestureContainer: {
      flex: 1,
    },
    scrollContent: {
      padding: spacing.lg,
      flexGrow: 1,
    },
    navigationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.md,
      gap: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    navButton: {
      flex: 1,
    },
    navButtonContent: {
      paddingVertical: spacing.sm,
    },
    footer: {
      padding: spacing.md,
      borderTopWidth: 1,
      borderTopColor: currentColors.borderLight,
    },
    footerText: {
      ...typography.caption,
      color: currentColors.textTertiary,
      textAlign: 'center',
      fontStyle: 'italic',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    loadingIcon: {
      fontSize: 48,
      marginBottom: spacing.md,
    },
    loadingText: {
      ...typography.h3,
      color: currentColors.text,
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    loadingSubtext: {
      ...typography.body,
      color: currentColors.textSecondary,
      textAlign: 'center',
    },
    swipeHint: {
      marginTop: spacing.md,
      padding: spacing.sm,
      alignItems: 'center',
    },
    swipeHintText: {
      ...typography.caption,
      color: currentColors.textTertiary,
      fontStyle: 'italic',
    },
    footerIconContainer: {
      backgroundColor: currentColors.surface,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>💭</Text>
          <Text style={styles.loadingText}>Generating personalized tradeoffs...</Text>
          <Text style={styles.loadingSubtext}>This will just take a moment</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>😕</Text>
          <Text style={styles.loadingText}>No tradeoffs available</Text>
          <Text style={styles.loadingSubtext}>Please complete onboarding first</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.counter}>
          {currentIndex + 1} of {cards.length}
        </Text>
      </View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
        failOffsetY={[-5, 5]}
      >
        <Animated.View style={styles.gestureContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
          >
            <Animated.View style={cardStyle}>
              <TradeoffCard
                title={currentCard.title}
                optionA={currentCard.optionA}
                optionB={currentCard.optionB}
              />
            </Animated.View>
            <View style={styles.swipeHint}>
              <Text style={styles.swipeHintText}>
                👆 Swipe left or right to navigate • Tap buttons below
              </Text>
            </View>
          </ScrollView>
        </Animated.View>
      </PanGestureHandler>
      <View style={styles.navigationContainer}>
        <Button
          mode="outlined"
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          buttonColor={currentColors.surface}
          textColor={currentIndex === 0 ? currentColors.textTertiary : currentColors.text}
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
        >
          ← Previous
        </Button>
        <Button
          mode="outlined"
          onPress={handleNext}
          disabled={currentIndex === cards.length - 1}
          buttonColor={currentColors.surface}
          textColor={currentIndex === cards.length - 1 ? currentColors.textTertiary : currentColors.primary}
          style={styles.navButton}
          contentStyle={styles.navButtonContent}
        >
          Next →
        </Button>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tradeoffs are based on your salary and expenses
        </Text>
      </View>
      <SafeAreaView edges={['bottom']} style={styles.footerIconContainer}>
        <Footer navigation={navigation} />
      </SafeAreaView>
    </SafeAreaView>
  );
}
