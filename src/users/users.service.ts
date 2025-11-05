import { ConflictException, Injectable } from '@nestjs/common';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existing = await this.userModel.findOne({ email: createUserDto.email });
        if (existing) throw new Error(`A user already exists with this email: ${createUserDto.email}`);

        const newUser = new this.userModel(createUserDto);
        return newUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        return this.userModel.findById(id).exec();
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        if (!Types.ObjectId.isValid(id)) return null;
        
        if (updateUserDto.email) {
            const existing = await this.userModel.findOne({
                email: updateUserDto.email,
                _id: { $ne: id }
            });

            if (existing) throw new ConflictException('This email address is already in use.');
        }
        return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    }

    async remove(id: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(id)) return false;
        const result = await this.userModel.findByIdAndDelete(id).exec();
        return !!result;
    }
}
