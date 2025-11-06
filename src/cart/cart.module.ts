import { forwardRef, Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { CartItem, CartItemSchema } from './entities/cart-item.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CartItem.name, schema: CartItemSchema  }]),
    UsersModule,
    forwardRef(() => ProductsModule)
  ],
  controllers: [CartController],
  providers: [CartService, UsersService, ProductsService],
  exports: [CartService]
})
export class CartModule {}
