import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateUserDto } from '../dtos/requests/create-user.dto';
import { UpdateUserDto } from '../dtos/requests/update-user.dto';
import { User } from '../schemas/user.schema';
import { omit } from 'lodash';
import {
  NOT_ALLOWED_UPDATE,
  USER_ROLE,
  USER_STATUS,
} from '../constants/user.constat';
import { SearchUserDto } from '../dtos/requests/search-user.dto';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async create(user: CreateUserDto) {
    const [usernameExist, emailExist] = await Promise.all([
      this.userModel.findOne({ username: user.username }),
      this.userModel.findOne({ email: user.email }),
    ]);
    if (usernameExist) {
      throw new HttpException(
        'User with this username already exist.',
        HttpStatus.CONFLICT,
      );
    }

    if (emailExist) {
      throw new HttpException(
        'User with this email already exist.',
        HttpStatus.CONFLICT,
      );
    }

    const hashed = await this.authService.hashPassword(user.password);

    const createdUser = await this.userModel.create({
      ...user,
      password: hashed,
      status: user.status ? user.status : USER_STATUS.ACTIVE,
      role: user.role ? user.role : USER_ROLE.USER,
    });

    return createdUser;
  }

  async updateById(id: string | ObjectId, user: UpdateUserDto) {
    const exist = await this.userModel.exists({ _id: id });
    if (!exist) {
      throw new HttpException(
        'User with this id does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    omit(user, NOT_ALLOWED_UPDATE);
   
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id },
      user,
      { new: true },
    );
    return updatedUser;
  }

  async deleteById(id: string | ObjectId) {
    const exist = await this.userModel.exists({ _id: id });
    if (!exist) {
      throw new HttpException(
        'User with this id does not exist.',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.userModel.deleteOne({ _id: id });
  }

  async getById(id: string | ObjectId) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) {
      // throw new HttpException("User with this id does not exist.", HttpStatus.NOT_FOUND);
      return null;
    }
    return user;
  }

  async getByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      // throw new HttpException("User with is email does not exist.", HttpStatus.NOT_FOUND)
      return null;
    }
    return user;
  }

  async getByUsername(username: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      // throw new HttpException("User with this username does not exist.", HttpStatus.NOT_FOUND);
      return null;
    }
    return user;
  }

  async updateRefreshToken(id: ObjectId | string, refreshToken: string) {
    return this.userModel.updateOne({ _id: id }, { refreshToken });
  }

  async search(query: SearchUserDto) {

    const [users, total] = await Promise.all([this.userModel.find({}).skip(query.pageNumber * query.pageSize).limit(query.pageSize), this.userModel.find({}).countDocuments()]);
    return { users, total}
  }
}