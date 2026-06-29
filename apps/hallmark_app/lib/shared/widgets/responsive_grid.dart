// lib/shared/widgets/responsive_grid.dart
// Extracted from main.dart — ZERO UI changes

import 'package:flutter/material.dart';

class ResponsiveGrid extends StatelessWidget {
  const ResponsiveGrid({super.key, required this.children});

  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final width   = constraints.maxWidth;
        final columns = width > 1000 ? 3 : width > 640 ? 2 : 1;
        const gap     = 16.0;
        final itemWidth = (width - (columns - 1) * gap) / columns;

        return Wrap(
          spacing: gap,
          runSpacing: gap,
          children: children
              .map((child) => SizedBox(width: itemWidth, child: child))
              .toList(),
        );
      },
    );
  }
}