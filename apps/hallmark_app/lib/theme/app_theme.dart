import 'package:flutter/material.dart';

class AppColors {
  static const Color gold = Color(0xFFC9960C);
  static const Color goldLight = Color(0xFFFDF3D9);
  static const Color goldDark = Color(0xFF8B6A00);
  
  static const Color navy = Color(0xFF1A2340);
  static const Color navy2 = Color(0xFF243050);
  static const Color navy3 = Color(0xFF2E3D60);
  
  static const Color green = Color(0xFF1B7A3E);
  static const Color red = Color(0xFFC0392B);
  static const Color blue = Color(0xFF1565C0);
  
  static const Color bg = Color(0xFFFAFAF8);
  static const Color card = Colors.white;
  static const Color text = Color(0xFF1A1A1A);
  static const Color text3 = Color(0xFF888888);
  static const Color border = Color(0xFFE0DDD6);
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      // This applies your specific HTML background color to the whole app
      scaffoldBackgroundColor: AppColors.bg,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.gold,
        brightness: Brightness.light,
      ),
      useMaterial3: true,
      // Default text styling to match your HTML text color
      textTheme: const TextTheme(
        bodyLarge: TextStyle(color: AppColors.text),
        bodyMedium: TextStyle(color: AppColors.text),
      ),
    );
  }
}