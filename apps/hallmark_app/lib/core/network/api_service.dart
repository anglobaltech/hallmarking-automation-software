import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:flutter/foundation.dart';

class ApiService {
  static const String _baseUrl = 'http://127.0.0.1:4000';

  /// Fetch pending articles for HUID assignment
  Future<List<Map<String, dynamic>>> fetchPendingHuid() async {
    try {
      final response = await http.get(
        Uri.parse('$_baseUrl/api/huid/pending'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data['pending'] ?? []);
      } else {
        debugPrint('Failed to fetch pending HUID: ${response.statusCode}');
        return [];
      }
    } catch (e) {
      debugPrint('fetchPendingHuid error: $e');
      return [];
    }
  }

  /// Assign HUID to an article
  Future<bool> assignHuid(Map<String, dynamic> data) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl/api/huid/assign'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'articleId': data['articleId'],
          'huidNumber': data['huidNumber'],
          'hallmarkYear': data['hallmarkYear'],
          'assayOffice': data['assayOffice'],
          'certifiedPurity': data['certifiedPurity'],
        }),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        debugPrint('Assign HUID failed: ${response.statusCode}');
        return false;
      }
    } catch (e) {
      debugPrint('assignHuid error: $e');
      return false;
    }
  }
}