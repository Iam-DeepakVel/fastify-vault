import { User } from '../user/user.model';
import { prop, Ref, getModelForClass } from '@typegoose/typegoose';

export class Vault {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ default: '' })
  data: string;

  @prop({ required: true })
  salt: string;
}
export const VaultModel = getModelForClass(Vault, {
  schemaOptions: {
    timestamps: true,
  },
});
