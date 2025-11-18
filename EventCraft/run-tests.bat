@echo off
REM EventCraft Test Execution Script
REM Runs comprehensive QA test suite

echo ========================================
echo EventCraft QA Test Suite Execution
echo ========================================
echo.

echo [1/5] Running Unit Tests (Service Layer)...
call mvn test -Dtest=*ServiceTest
if %errorlevel% neq 0 (
    echo Unit tests failed!
    exit /b %errorlevel%
)

echo.
echo [2/5] Running Repository Tests...
call mvn test -Dtest=*RepositoryTest
if %errorlevel% neq 0 (
    echo Repository tests failed!
    exit /b %errorlevel%
)

echo.
echo [3/5] Running Controller/API Tests...
call mvn test -Dtest=*ControllerTest
if %errorlevel% neq 0 (
    echo Controller tests failed!
    exit /b %errorlevel%
)

echo.
echo [4/5] Running End-to-End Flow Tests...
call mvn test -Dtest=EndToEndFlowTest
if %errorlevel% neq 0 (
    echo End-to-end tests failed!
    exit /b %errorlevel%
)

echo.
echo [5/5] Running Security Tests...
call mvn test -Dtest=SecurityTest
if %errorlevel% neq 0 (
    echo Security tests failed!
    exit /b %errorlevel%
)

echo.
echo ========================================
echo All Tests Completed Successfully!
echo ========================================
echo.
echo Test reports available in: target/surefire-reports/
pause

