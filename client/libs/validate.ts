export type ValidateType = (value: string) => RegExpMatchArray | null;

export const validateEmail: ValidateType = (value) => {
  return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
};

export const validateName: ValidateType = (value) => {
  return value.match(
    /^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\d\\s]+$/i
  );
};

export const validatePassword: ValidateType = (value) => {
  return value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/);
};

export const validateSlug: ValidateType = (value) => {
  return value.match(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
};

export const validateURL: ValidateType = (value) => {
  return value.match(
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i
  );
};

export const validatePhone: ValidateType = (value) => {
  return value.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g);
};
