<?php

namespace App\Services\V1\API;

use Illuminate\Http\JsonResponse;

class APIService
{
    public function sendResponse(int $statusCode, string $message, $data = null): JsonResponse
    {
        return response()->json([
            'status' => $statusCode >= 200 && $statusCode < 300 ? 'success' : 'error',
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }

    public function sendSuccess(string $message, $data = null): JsonResponse
    {
        if (empty($data)) {
            return response()->json([
                'status' => 'success',
                'message' => $message,
            ], 200);
        }

        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], 200);
    }

    public function sendCreated(string $message, $data = null): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ], 201);
    }

    public function sendError(string $message): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message,
        ], 400);
    }

    public function sendUnauthorized(string $message = "Unauthorized"): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 401);
    }

    public function sendForbidden(string $message = "Forbidden"): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 403);
    }

    public function sendNotFound(string $message = "Not Found"): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 404);
    }

    public function sendMethodNotAllowed(string $message = "Method Not Allowed"): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 405);
    }

    public function sendConflict(string $message = "Conflict"): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 409);
    }

    public function sendInternalServerError(string $message = "Internal Server Error"): JsonResponse
    {
        return response()->json([
            'status' => 'error',
            'message' => $message
        ], 500);
    }
}
