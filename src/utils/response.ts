export const successResponse = (res: any, data: any, message = "Success") =>

  res.status(200).json({ success: true, error:false, message, data });



export const errorResponse = (

  res: any,

  message = "Something went wrong",

  status = 500

) => res.status(status).json({ success: false, error: true, data : [], message });

