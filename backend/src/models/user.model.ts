import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
  Unique,
  AllowNull,
} from 'sequelize-typescript';

@Table
export class User extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare password: string;
  @Column({
    type: DataType.ENUM,
    values: ['user', 'admin'],
    allowNull: false,
    defaultValue: 'user',
  })
  declare role: 'user' | 'admin';

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    defaultValue: null,
  })
  declare otp: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.DATE,
    defaultValue: null,
  })
  declare otpExpiry: Date;
}
