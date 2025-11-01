import { Textarea } from "../../ui/textarea";
import { FormBase, type FormControlFunc } from "./FormBase";

export const FormTextarea: FormControlFunc = (props) => {
  return <FormBase {...props}>{(field) => <Textarea {...field} />}</FormBase>;
};
