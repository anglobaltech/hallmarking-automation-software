// Extracted from main.dart — zero changes to logic or values

enum DeskRole { reception, quality, xrf, huid, admin }

extension DeskRoleLabel on DeskRole {
  String get label {
    switch (this) {
      case DeskRole.reception: return 'Reception';
      case DeskRole.quality:   return 'Quality';
      case DeskRole.xrf:       return 'XRF';
      case DeskRole.huid:      return 'HUID';
      case DeskRole.admin:     return 'Admin';
    }
  }
}