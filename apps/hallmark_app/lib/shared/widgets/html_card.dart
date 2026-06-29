// lib/shared/widgets/html_card.dart
// Extracted from main.dart — ZERO UI changes

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';

class HTMLCard extends StatelessWidget {
  const HTMLCard({super.key, required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.card,
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: AppColors.text)),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}