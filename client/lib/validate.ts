export type ValidateType = (value: string) => RegExpMatchArray | null;

export const validateEmail: ValidateType = (value) => {
  return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
};

export const validateName: ValidateType = (value) => {
  return value.match(
    /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\d\\s]+$/i
  );
};

export const validateSlug: ValidateType = (value) => {
  return value.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/i);
};

export const validateURL: ValidateType = (value) => {
  return value.match(
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
  );
};
