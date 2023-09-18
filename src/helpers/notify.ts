declare const Toastify: any;

export default class Notify {
  static success(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      background: "#0ab39c",
      stopOnFocus: true,
    }).showToast();
  }

  static error(message: string) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "#f06548",
      }
    }).showToast();
  }
}