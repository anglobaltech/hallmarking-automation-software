// lib/shared/widgets/stat_tile.dart
// Extracted from main.dart — ZERO UI changes

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class HTMLStatTile extends StatelessWidget {
  const HTMLStatTile({
    super.key,
    required this.label,
    required this.value,
    required this.sub,
    this.isGold  = false,
    this.isGreen = false,
    this.isBlue  = false,
    this.isRed   = false,
  });

  final String label;
  final String value;
  final String sub;
  final bool isGold;
  final bool isGreen;
  final bool isBlue;
  final bool isRed;

  @override
  Widget build(BuildContext context) {
    Color valColor = AppColors.text;
    if (isGold)  valColor = AppColors.goldDark;
    if (isGreen) valColor = AppColors.green;
    if (isBlue)  valColor = AppColors.blue;
    if (isRed)   valColor = AppColors.red;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontSize: 12, color: AppColors.text3)),
          const SizedBox(height: 4),
          Text(value,
              style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: valColor,
                  height: 1)),
          const SizedBox(height: 4),
          Text(sub, style: const TextStyle(fontSize: 11, color: AppColors.text3)),
        ],
      ),
    );
  }
}