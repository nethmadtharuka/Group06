#!/bin/bash

# EventCraft Test Execution Script
# Runs comprehensive QA test suite

echo "========================================"
echo "EventCraft QA Test Suite Execution"
echo "========================================"
echo ""

echo "[1/5] Running Unit Tests (Service Layer)..."
mvn test -Dtest=*ServiceTest
if [ $? -ne 0 ]; then
    echo "Unit tests failed!"
    exit 1
fi

echo ""
echo "[2/5] Running Repository Tests..."
mvn test -Dtest=*RepositoryTest
if [ $? -ne 0 ]; then
    echo "Repository tests failed!"
    exit 1
fi

echo ""
echo "[3/5] Running Controller/API Tests..."
mvn test -Dtest=*ControllerTest
if [ $? -ne 0 ]; then
    echo "Controller tests failed!"
    exit 1
fi

echo ""
echo "[4/5] Running End-to-End Flow Tests..."
mvn test -Dtest=EndToEndFlowTest
if [ $? -ne 0 ]; then
    echo "End-to-end tests failed!"
    exit 1
fi

echo ""
echo "[5/5] Running Security Tests..."
mvn test -Dtest=SecurityTest
if [ $? -ne 0 ]; then
    echo "Security tests failed!"
    exit 1
fi

echo ""
echo "========================================"
echo "All Tests Completed Successfully!"
echo "========================================"
echo ""
echo "Test reports available in: target/surefire-reports/"

