import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const user = await this.usersService.findOne(id);

        if (!user) {
            throw new NotFoundException(`User with id: ${id} not found.`);
        }
        return user;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        const result = await this.usersService.update(id, updateUserDto);

        if (result === null) {
            throw new NotFoundException(`User with id: ${id} not found.`);
        }

        return result;
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        const value = await this.usersService.remove(id);

        if (!value) {
            throw new NotFoundException(`User with id: ${id} not found.`);
        }

        return { message: `User with id: ${id} was deleted successfully.` }
    }
}
