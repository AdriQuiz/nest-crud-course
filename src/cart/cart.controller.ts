import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartsService: CartService) {}

    @Post()
    async create(@Body() addCartItemDto: AddCartItemDto) {
        return this.cartsService.create(addCartItemDto);
    }

    @Get(':userId')
    async findAll(@Param('userId') userId: string) {
        return this.cartsService.findAll(userId);
    }

    @Put(':id')
    async updateQuantity(@Param('id') id: string, @Body() updateCartDto: UpdateCartItemDto) {
        return this.cartsService.updateQuantity(id, updateCartDto);
    }

    @Delete(':id')
    async removeItem(@Param('id') id: string) {
        const value = await this.cartsService.removeItem(id);
        if (!value) {
            throw new NotFoundException(`Item with id: ${id} not found.`);
        }
        return { message: `Item with id: ${id} was deleted successfully.` }
    }
}
