// lib/features/huid/presentation/huid_screen.dart
// Extracted from main.dart — ZERO UI changes, ZERO logic changes
// Only thing added: the import statements

import 'package:flutter/material.dart';
import '../../../theme/app_theme.dart';
import '../../../core/network/api_service.dart';


class HuidDesk extends StatefulWidget {
  const HuidDesk({super.key});

  @override
  State<HuidDesk> createState() => _HuidDeskState();
}

class _HuidDeskState extends State<HuidDesk> {
  final ApiService _apiService = ApiService();
  List<Map<String, dynamic>> _pendingArticles = [];
  bool _isLoading = true;

  // Form Controllers
  final TextEditingController _articleIdController = TextEditingController();
  final TextEditingController _huidController      = TextEditingController();
  final TextEditingController _yearController      = TextEditingController();
  final TextEditingController _assayController     = TextEditingController();
  String _selectedPurity = '916 (22K)';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _articleIdController.dispose();
    _huidController.dispose();
    _yearController.dispose();
    _assayController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final data = await _apiService.fetchPendingHuid();
    setState(() {
      _pendingArticles = data;
      _isLoading = false;
    });
  }

  void _selectArticle(Map<String, dynamic> article) {
    setState(() {
      _articleIdController.text = article['id'].toString();
      _huidController.clear();
      _yearController.text  = 'A (${DateTime.now().year})';
      _assayController.text = 'BHC Code';
    });
  }

  Future<void> _submitHuid() async {
    if (_articleIdController.text.isEmpty || _huidController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please fill Article ID and HUID Number'),
          backgroundColor: AppColors.red,
        ),
      );
      return;
    }

    final success = await _apiService.assignHuid({
      'articleId':       _articleIdController.text,
      'huidNumber':      _huidController.text,
      'hallmarkYear':    _yearController.text,
      'assayOffice':     _assayController.text,
      'certifiedPurity': _selectedPurity,
    });

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('HUID Assigned Successfully!'),
          backgroundColor: AppColors.green,
        ),
      );
      _articleIdController.clear();
      _huidController.clear();
      _loadData();
    }
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ── Info Banner ────────────────────────────────────────────────
          Container(
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.only(bottom: 16),
            decoration: BoxDecoration(
              color: const Color(0xFFE3F0FF),
              border: Border.all(color: const Color(0xFF90B4E0)),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, color: AppColors.blue, size: 18),
                const SizedBox(width: 10),
                RichText(
                  text: TextSpan(
                    style: const TextStyle(fontSize: 13, color: AppColors.blue),
                    children: [
                      TextSpan(
                        text: '${_pendingArticles.length} articles ',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const TextSpan(
                        text: 'are awaiting HUID assignment. Enter HUID numbers from the BIS Manak Portal below.',
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // ── Split layout: Form (left) + Table (right) ──────────────────
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ── LEFT: Form ──────────────────────────────────────────────
              Expanded(
                flex: 5,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Assign HUID',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: AppColors.text)),
                      const SizedBox(height: 16),

                      Row(children: [
                        Expanded(child: _buildTextField('Article ID *',   'ART-2024-XXX',   _articleIdController)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildTextField('HUID Number *',  'e.g. HX7892345', _huidController)),
                      ]),
                      const SizedBox(height: 16),

                      Row(children: [
                        Expanded(child: _buildTextField('Hallmark Year',  'e.g. A (2024)',   _yearController)),
                        const SizedBox(width: 16),
                        Expanded(child: _buildTextField('Assay Office',   'BHC Code',        _assayController)),
                      ]),
                      const SizedBox(height: 16),

                      Row(children: [
                        // Purity dropdown
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Certified Purity',
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: AppColors.text3)),
                              const SizedBox(height: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12),
                                decoration: BoxDecoration(
                                  border: Border.all(color: AppColors.border),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: DropdownButtonHideUnderline(
                                  child: DropdownButton<String>(
                                    isExpanded: true,
                                    value: _selectedPurity,
                                    items: ['916 (22K)', '750 (18K)', '585 (14K)']
                                        .map((p) => DropdownMenuItem(
                                              value: p,
                                              child: Text(p,
                                                  style: const TextStyle(fontSize: 13)),
                                            ))
                                        .toList(),
                                    onChanged: (val) =>
                                        setState(() => _selectedPurity = val!),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: _buildTextField(
                            'Marking Date',
                            'dd - mm - yyyy',
                            TextEditingController(),
                            isDate: true,
                          ),
                        ),
                      ]),
                      const SizedBox(height: 24),

                      // Barcode scanner zone
                      const Text('SCAN HUID BARCODE',
                          style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: AppColors.text3)),
                      const SizedBox(height: 8),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 20),
                        decoration: BoxDecoration(
                          color: AppColors.bg,
                          border: Border.all(color: AppColors.border),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Column(children: [
                          Icon(Icons.qr_code_scanner,
                              color: AppColors.gold, size: 28),
                          SizedBox(height: 8),
                          Text('Click to scan HUID barcode / QR',
                              style: TextStyle(
                                  fontSize: 13, color: AppColors.text3)),
                        ]),
                      ),
                      const SizedBox(height: 20),

                      // Action buttons
                      Row(children: [
                        ElevatedButton.icon(
                          onPressed: _submitHuid,
                          icon: const Icon(Icons.check,
                              size: 16, color: Colors.white),
                          label: const Text('Assign HUID',
                              style: TextStyle(color: Colors.white)),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.gold,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        OutlinedButton.icon(
                          onPressed: () {},
                          icon: const Icon(Icons.print,
                              size: 16, color: AppColors.text),
                          label: const Text('Print Certificate',
                              style: TextStyle(color: AppColors.text)),
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 20, vertical: 14),
                            side: const BorderSide(color: AppColors.border),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(6)),
                          ),
                        ),
                      ]),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 16),

              // ── RIGHT: Pending articles table ───────────────────────────
              Expanded(
                flex: 4,
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    border: Border.all(color: AppColors.border),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text('Pending HUID',
                              style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.text)),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: AppColors.goldLight,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${_pendingArticles.length}',
                              style: const TextStyle(
                                  color: AppColors.goldDark,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      _isLoading
                          ? const Center(
                              child: CircularProgressIndicator(
                                  color: AppColors.gold))
                          : Table(
                              columnWidths: const {
                                0: FlexColumnWidth(1.2),
                                1: FlexColumnWidth(1.5),
                                2: FlexColumnWidth(1.0),
                                3: FlexColumnWidth(1.0),
                                4: FlexColumnWidth(1.0),
                              },
                              children: [
                                // Header row
                                const TableRow(
                                  decoration: BoxDecoration(
                                      border: Border(
                                          bottom: BorderSide(
                                              color: AppColors.border))),
                                  children: [
                                    Padding(
                                      padding: EdgeInsets.symmetric(vertical: 10),
                                      child: Text('ARTICLE',
                                          style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.text3)),
                                    ),
                                    Padding(
                                      padding: EdgeInsets.symmetric(vertical: 10),
                                      child: Text('CUSTOMER',
                                          style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.text3)),
                                    ),
                                    Padding(
                                      padding: EdgeInsets.symmetric(vertical: 10),
                                      child: Text('PURITY',
                                          style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.text3)),
                                    ),
                                    Padding(
                                      padding: EdgeInsets.symmetric(vertical: 10),
                                      child: Text('WEIGHT',
                                          style: TextStyle(
                                              fontSize: 10,
                                              fontWeight: FontWeight.bold,
                                              color: AppColors.text3)),
                                    ),
                                    SizedBox(),
                                  ],
                                ),
                                // Data rows
                                ..._pendingArticles.map((article) => TableRow(
                                      decoration: const BoxDecoration(
                                          border: Border(
                                              bottom: BorderSide(
                                                  color: Color(0xFFF5F5F5)))),
                                      children: [
                                        Padding(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          child: Text(
                                            article['id']?.toString() ?? '',
                                            style: const TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color: AppColors.goldDark),
                                          ),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          child: Text(
                                            article['customer_name']?.toString() ?? '',
                                            style: const TextStyle(fontSize: 12),
                                          ),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          child: Text(
                                            article['declared_purity']?.toString() ?? '',
                                            style: const TextStyle(fontSize: 12),
                                          ),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 12),
                                          child: Text(
                                            '${article['gross_weight']}g',
                                            style: const TextStyle(fontSize: 12),
                                          ),
                                        ),
                                        Padding(
                                          padding: const EdgeInsets.symmetric(
                                              vertical: 8),
                                          child: ElevatedButton(
                                            onPressed: () =>
                                                _selectArticle(article),
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: AppColors.gold,
                                              minimumSize: const Size(0, 28),
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 10,
                                                      vertical: 0),
                                            ),
                                            child: const Text('Select',
                                                style: TextStyle(
                                                    fontSize: 11,
                                                    color: Colors.white)),
                                          ),
                                        ),
                                      ],
                                    )),
                              ],
                            ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTextField(
    String label,
    String hint,
    TextEditingController controller, {
    bool isDate = false,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: AppColors.text3)),
        const SizedBox(height: 6),
        TextField(
          controller: controller,
          style: const TextStyle(fontSize: 13),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: AppColors.text3),
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            suffixIcon: isDate
                ? const Icon(Icons.calendar_today,
                    size: 16, color: AppColors.text3)
                : null,
            enabledBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: AppColors.border),
                borderRadius: BorderRadius.circular(6)),
            focusedBorder: OutlineInputBorder(
                borderSide: const BorderSide(color: AppColors.gold),
                borderRadius: BorderRadius.circular(6)),
          ),
        ),
      ],
    );
  }
}