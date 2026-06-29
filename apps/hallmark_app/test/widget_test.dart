import 'package:flutter_test/flutter_test.dart';
import 'package:hallmark_app/main.dart';   // ← Correct import

void main() {
  testWidgets('HallmarkApp renders basic screens', (WidgetTester tester) async {
    await tester.pumpWidget(const HallmarkApp());

    // Update these expectations according to your actual UI
    expect(find.text('Pending HUID'), findsOneWidget);
    // Add more expectations as needed
  });
}