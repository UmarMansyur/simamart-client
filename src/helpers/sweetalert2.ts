declare const Swal: any;

export default class Sweet {
  static success(message: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: message,
    });
  }
  static error(message: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: message,
    });
  }
  static warning(message: string): void {
    Swal.fire({
      icon: 'warning',
      title: 'Peringatan',
      text: message,
    });
  }
  static info(message: string): void {
    Swal.fire({
      icon: 'info',
      title: 'Informasi',
      text: message,
    });
  }

  static confirm(message: string, callback?: any): void {
    Swal.fire({
      icon: 'question',
      title: 'Apakah anda yakin?',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Ya',
      cancelButtonText: 'Tidak',
    }).then((result: any) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }
}