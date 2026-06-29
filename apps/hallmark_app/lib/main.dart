import 'package:flutter/material.dart';
import 'theme/app_theme.dart';
import 'core/constants/desk_role.dart'; 
import 'features/huid/presentation/huid_screen.dart';

void main() => runApp(const HallmarkApp());

class HallmarkApp extends StatefulWidget {
  const HallmarkApp({super.key});

  @override
  State<HallmarkApp> createState() => _HallmarkAppState();
}

class _HallmarkAppState extends State<HallmarkApp> {
  DeskRole _role       = DeskRole.admin;
  DeskRole _activeDesk = DeskRole.reception;

  bool get _canSwitchDesks => _role == DeskRole.admin;

  void _setRole(DeskRole role) {
    setState(() {
      _role       = role;
      _activeDesk = role == DeskRole.admin ? DeskRole.reception : role;
    });
  }

  void _setDesk(DeskRole desk) {
    if (!_canSwitchDesks && desk != _role) return;
    setState(() => _activeDesk = desk);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'HUID Manager',
      theme: AppTheme.lightTheme,
      home: Scaffold(
        backgroundColor: AppColors.bg,
        body: Column(children: [
          _buildTopBar(),
          _buildDeskNav(),
          Expanded(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSidebar(),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(20),
                   child: DeskWorkspace(desk: _activeDesk, role: _role),
                  ),
                ),
              ],
            ),
          ),
        ]),
      ),
    );
  }

  // ── TOP BAR ────────────────────────────────────────────────────────────────
  Widget _buildTopBar() {
    return Container(
      height: 52,
      color: AppColors.navy,
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Logo + title
          Row(children: [
            Container(
              width: 32, height: 32,
              decoration: const BoxDecoration(
                  color: AppColors.gold, shape: BoxShape.circle),
              alignment: Alignment.center,
              child: const Text('⚜',
                  style: TextStyle(fontSize: 16, color: Colors.white)),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('HUID Manager',
                    style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        letterSpacing: 0.5)),
                Text('Hallmarking Centre Suite',
                    style: TextStyle(
                        color: Color(0xFF77AABB),
                        fontSize: 10,
                        letterSpacing: 0.5)),
              ],
            ),
          ]),

          // Role dropdown + icons
          Row(children: [
            DropdownButtonHideUnderline(
              child: DropdownButton<DeskRole>(
                dropdownColor: AppColors.navy2,
                icon: const Icon(Icons.arrow_drop_down, color: Colors.white70),
                style: const TextStyle(color: Colors.white, fontSize: 12),
                value: _role,
                onChanged: (value) { if (value != null) _setRole(value); },
                items: DeskRole.values
                    .map((desk) => DropdownMenuItem(
                          value: desk,
                          child: Text('Simulate: ${desk.label}'),
                        ))
                    .toList(),
              ),
            ),
            const SizedBox(width: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                  border: Border.all(color: const Color(0xFF334455)),
                  borderRadius: BorderRadius.circular(6)),
              child: const Icon(Icons.notifications_none,
                  color: Color(0xFF99AABB), size: 18),
            ),
            const SizedBox(width: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                  border: Border.all(color: const Color(0xFF334455)),
                  borderRadius: BorderRadius.circular(6)),
              child: const Icon(Icons.lock_outline,
                  color: Color(0xFF99AABB), size: 18),
            ),
          ]),
        ],
      ),
    );
  }

  // ── DESK NAV ───────────────────────────────────────────────────────────────
  Widget _buildDeskNav() {
    final desks = [
      DeskRole.reception, DeskRole.quality,
      DeskRole.xrf,       DeskRole.huid,
      DeskRole.admin,
    ];

    return Container(
      height: 48,
      decoration: const BoxDecoration(
        color: AppColors.navy2,
        border: Border(bottom: BorderSide(color: AppColors.navy3, width: 2)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: desks.map((desk) {
          final isActive   = _activeDesk == desk;
          final isDisabled = !_canSwitchDesks && desk != _role;

          return InkWell(
            onTap: isDisabled ? null : () => _setDesk(desk),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              decoration: BoxDecoration(
                color: isActive
                    ? Colors.white.withValues(alpha: 0.06)
                    : Colors.transparent,
                border: Border(
                  bottom: BorderSide(
                    color: isActive
                        ? const Color(0xFFFFD86E)
                        : Colors.transparent,
                    width: 2,
                  ),
                ),
              ),
              child: Row(children: [
                Icon(_deskNavIcon(desk),
                    size: 16,
                    color: isActive
                        ? const Color(0xFFFFD86E)
                        : const Color(0xFF99AABB)),
                const SizedBox(width: 7),
                Text(
                  desk.label,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                    color: isActive
                        ? const Color(0xFFFFD86E)
                        : isDisabled
                            ? Colors.white30
                            : const Color(0xFF99AABB),
                  ),
                ),
              ]),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ── SIDEBAR ────────────────────────────────────────────────────────────────
  Widget _buildSidebar() {
    return Container(
      width: 210,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(right: BorderSide(color: AppColors.border)),
      ),
      child: ListView(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 6),
          child: Text(
            _activeDesk.label.toUpperCase(),
            style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: AppColors.text3,
                letterSpacing: 0.8),
          ),
        ),
        ..._getSidebarItemsForDesk(_activeDesk),
      ]),
    );
  }

  List<Widget> _getSidebarItemsForDesk(DeskRole desk) {
    switch (desk) {
      case DeskRole.reception:
        return [
          _sidebarItem(Icons.dashboard,             'Dashboard',       isActive: true),
          _sidebarItem(Icons.add_circle_outline,    'Article Intake'),
          _sidebarItem(Icons.list_alt,              'Article Register', badge: '248', badgeColor: AppColors.gold),
          _sidebarItem(Icons.local_shipping_outlined,'Delivery / Return'),
        ];
      case DeskRole.quality:
        return [
          _sidebarItem(Icons.fact_check_outlined, 'Inspection Queue', isActive: true),
          _sidebarItem(Icons.update,              'Process Update'),
        ];
      case DeskRole.xrf:
        return [
          _sidebarItem(Icons.science_outlined, 'XRF Testing',   isActive: true),
          _sidebarItem(Icons.scale_outlined,   'Weight Check'),
        ];
      case DeskRole.huid:
        return [
          _sidebarItem(Icons.qr_code_scanner, 'HUID Entry',    isActive: true, badge: '14'),
          _sidebarItem(Icons.storage,          'HUID Register'),
        ];
      case DeskRole.admin:
        return [
          _sidebarItem(Icons.assessment_outlined,        'Daily Report',  isActive: true),
          _sidebarItem(Icons.notifications_active_outlined,'Reminders',   badge: '3'),
          _sidebarItem(Icons.settings_outlined,          'Settings'),
        ];
    }
  }

  Widget _sidebarItem(
    IconData icon,
    String title, {
    bool isActive = false,
    String? badge,
    Color badgeColor = AppColors.red,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: isActive ? AppColors.goldLight : Colors.transparent,
        border: Border(
            left: BorderSide(
                color: isActive ? AppColors.gold : Colors.transparent,
                width: 3)),
      ),
      child: Row(children: [
        Icon(icon,
            size: 16,
            color: isActive ? AppColors.goldDark : AppColors.text3),
        const SizedBox(width: 9),
        Expanded(
          child: Text(
            title,
            style: TextStyle(
                fontSize: 13,
                color: isActive ? AppColors.goldDark : AppColors.text3,
                fontWeight:
                    isActive ? FontWeight.w600 : FontWeight.normal),
          ),
        ),
        if (badge != null)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1),
            decoration: BoxDecoration(
                color: badgeColor,
                borderRadius: BorderRadius.circular(10)),
            child: Text(badge,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold)),
          ),
      ]),
    );
  }

  IconData _deskNavIcon(DeskRole desk) {
    switch (desk) {
      case DeskRole.reception: return Icons.door_front_door_outlined;
      case DeskRole.quality:   return Icons.biotech_outlined;
      case DeskRole.xrf:       return Icons.science_outlined;
      case DeskRole.huid:      return Icons.qr_code_outlined;
      case DeskRole.admin:     return Icons.settings_outlined;
    }
  }
  
}
// ── DESK WORKSPACE ───────────────────────────────────────────────────────
class DeskWorkspace extends StatelessWidget {
  final DeskRole desk;
  final DeskRole role;

  const DeskWorkspace({super.key, required this.desk, required this.role});

  @override
  Widget build(BuildContext context) {
    if (desk == DeskRole.huid) {
     return const HuidDesk();
    }

    return Center(
      child: Text(
        '${desk.label} Desk\n\nComing Soon...',
        style: const TextStyle(fontSize: 22, color: Colors.grey),
        textAlign: TextAlign.center,
      ),
    );
  }
}