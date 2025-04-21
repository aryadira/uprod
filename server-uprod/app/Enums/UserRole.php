<?php

namespace App\Enums;

enum UserRole: int
{
    case ADMIN = 1;
    case SELLER = 2;
    case CUSTOMER = 3;
}
