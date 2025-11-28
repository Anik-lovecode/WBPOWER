<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Find first user
$user = \App\Models\User::first();
if (!$user) {
    echo "No users found\n";
    exit(1);
}

try {
    $token = $user->createToken('cli-test')->accessToken;
    echo "TOKEN_OK:\n" . $token . PHP_EOL;
} catch (\Throwable $e) {
    echo "TOKEN_ERR:\n" . $e->getMessage() . PHP_EOL;
    exit(1);
}
