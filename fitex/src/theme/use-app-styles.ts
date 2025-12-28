import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContex'

export const useAppStyles = () => {
  const { colors, isDark } = useTheme();

  const styles = StyleSheet.create({
    // Основные контейнеры
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    // Карточки
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    cardSecondary: {
      backgroundColor: colors.cardSecondary,
      borderRadius: 12,
      padding: 12,
    },

    // Текст
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 4,
    },
    text: {
      fontSize: 14,
      color: colors.text,
    },
    textSecondary: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    textTertiary: {
      fontSize: 12,
      color: colors.textTertiary,
    },

    // Заголовки разделов
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
      marginTop: 24,
    },

    // Кнопки
    buttonPrimary: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonPrimaryText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonSecondary: {
      backgroundColor: colors.cardSecondary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonSecondaryText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '500',
    },
    buttonOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    buttonOutlineText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },

    // Формы
    input: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
    },
    inputLabel: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 8,
    },

    // Разделители
    separator: {
      height: 1,
      backgroundColor: colors.separator,
      marginVertical: 16,
    },

    // Статусы
    statusSuccess: {
      backgroundColor: colors.success + '20',
      borderColor: colors.success,
    },
    statusWarning: {
      backgroundColor: colors.warning + '20',
      borderColor: colors.warning,
    },
    statusError: {
      backgroundColor: colors.error + '20',
      borderColor: colors.error,
    },

    // Иконки
    icon: {
      color: colors.textSecondary,
    },
    iconPrimary: {
      color: colors.primary,
    },
  });

  return { styles, colors, isDark };
};