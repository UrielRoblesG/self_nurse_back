export enum Role {
  Patient = 'user',
  Caregiver = 'caregiver',
  Doctor = 'doctor',
  Admin = 'admin',
}

export const getRole = (index: number): Role => {
  switch (index) {
    case 1:
      return Role.Patient;

    case 2:
      return Role.Caregiver;
    case 3:
      return Role.Doctor;
    case 4:
      return Role.Admin;
    default:
      throw new Error('No es un rol valido');
  }
};
