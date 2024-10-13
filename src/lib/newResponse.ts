class newResponse {
  constructor(
    public statusCode: number,
    public success: boolean = false,
    public message: string = ""
  ) // public data: Record<string, any> = {}
  {}
}

export { newResponse };

////////////////////////////////////////////////////////////////

// class newResponse {
//   status: number;
//   success: boolean;
//   message: string;
//   data: Record<string, any> = {};

//   constructor(
//     status: number,
//     success: boolean,
//     message: string,
//     data: Record<string, any> = {}
//   ) {
//     this.status = status;
//     this.success = success;
//     this.message = message;
//     this.data = data;
//   }
// }

// export { newResponse };
