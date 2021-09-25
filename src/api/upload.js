import request from "@/utils/request";

export function upload(data) {
  return request({
    url: "/Files/Upload",
    method: "post",
    data,
  });
}

export function UploadAndCreateThumb(data) {
  return request({
    url: "/Files/UploadAndCreateThumb?width=900&height=600",
    method: "post",
    data,
  });
}
