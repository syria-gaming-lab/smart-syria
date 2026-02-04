#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import uuid

class SyriaGameLabAPITester:
    def __init__(self, base_url="https://smart-syria.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_application_id = None

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        if details:
            print(f"   Details: {details}")

    def make_request(self, method, endpoint, data=None, headers=None):
        """Make HTTP request with error handling"""
        url = f"{self.api_url}/{endpoint}"
        default_headers = {'Content-Type': 'application/json'}
        
        if headers:
            default_headers.update(headers)
            
        try:
            if method == 'GET':
                response = requests.get(url, headers=default_headers, params=data)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=default_headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=default_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=default_headers)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except Exception as e:
            print(f"Request error: {str(e)}")
            return None

    def test_api_root(self):
        """Test API root endpoint"""
        response = self.make_request('GET', '')
        success = response and response.status_code == 200
        details = ""
        
        if response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    details = f"Message: {data.get('message', 'No message')}"
                except:
                    details = "Response not JSON"
            else:
                details = f"Status: {response.status_code}"
        else:
            details = "No response received"
            
        self.log_test("API Root Endpoint", success, details)
        return success

    def test_admin_login(self):
        """Test admin login functionality"""
        # Test with correct credentials
        login_data = {
            "username": "admin",
            "password": "sgl2025"
        }
        
        response = self.make_request('POST', 'admin/login', login_data)
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                self.admin_token = data.get('token')
                details = f"Token received: {self.admin_token[:20]}..." if self.admin_token else "No token"
            except:
                success = False
                details = "Invalid JSON response"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("Admin Login (Valid Credentials)", success, details)
        
        # Test with invalid credentials
        invalid_login = {
            "username": "wrong",
            "password": "wrong"
        }
        
        response = self.make_request('POST', 'admin/login', invalid_login)
        invalid_success = response and response.status_code == 401
        self.log_test("Admin Login (Invalid Credentials)", invalid_success, 
                     f"Status: {response.status_code if response else 'No response'}")
        
        return success

    def test_application_submission(self):
        """Test application submission"""
        # Create test application data
        test_email = f"test_{uuid.uuid4().hex[:8]}@example.com"
        
        application_data = {
            "full_name": "Test User",
            "age": 25,
            "residence": "Damascus",
            "email": test_email,
            "whatsapp": "+963999123456",
            "main_field": ["programming"],
            "main_field_other": "",
            "has_game_project": "yes",
            "game_project_details": "A simple 2D platformer",
            "known_tools": ["Unity"],
            "known_tools_other": "",
            "work_preference": "both",
            "time_commitment": "fullyCommitted",
            "internet_stability": "stableYes",
            "has_game_idea": "ideaYes",
            "game_idea_details": "RPG game about Syrian culture",
            "join_reason": "I want to learn game development",
            "wants_elite_stage": "eliteYes",
            "final_notes": "Looking forward to this opportunity"
        }
        
        response = self.make_request('POST', 'applications', application_data)
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                self.test_application_id = data.get('id')
                details = f"Application created with ID: {self.test_application_id}"
            except:
                success = False
                details = "Invalid JSON response"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            if response and response.status_code == 400:
                try:
                    error_data = response.json()
                    details += f" - {error_data.get('detail', 'Unknown error')}"
                except:
                    pass
                    
        self.log_test("Application Submission", success, details)
        
        # Test duplicate email prevention
        duplicate_response = self.make_request('POST', 'applications', application_data)
        duplicate_success = duplicate_response and duplicate_response.status_code == 400
        self.log_test("Duplicate Email Prevention", duplicate_success,
                     f"Status: {duplicate_response.status_code if duplicate_response else 'No response'}")
        
        return success

    def test_admin_applications_list(self):
        """Test getting applications list"""
        if not self.admin_token:
            self.log_test("Admin Applications List", False, "No admin token available")
            return False
            
        response = self.make_request('GET', 'admin/applications')
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                details = f"Found {len(data)} applications"
            except:
                success = False
                details = "Invalid JSON response"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("Admin Applications List", success, details)
        return success

    def test_admin_stats(self):
        """Test admin stats endpoint"""
        response = self.make_request('GET', 'admin/stats')
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                details = f"Stats: Total={data.get('total', 0)}, Pending={data.get('pending', 0)}, Accepted={data.get('accepted', 0)}, Rejected={data.get('rejected', 0)}"
            except:
                success = False
                details = "Invalid JSON response"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("Admin Stats", success, details)
        return success

    def test_application_status_update(self):
        """Test updating application status"""
        if not self.test_application_id:
            self.log_test("Application Status Update", False, "No test application ID available")
            return False
            
        update_data = {"status": "accepted"}
        response = self.make_request('PATCH', f'admin/applications/{self.test_application_id}', update_data)
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                details = f"Status updated to: {data.get('status', 'unknown')}"
            except:
                success = False
                details = "Invalid JSON response"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("Application Status Update", success, details)
        return success

    def test_application_retrieval(self):
        """Test getting single application"""
        if not self.test_application_id:
            self.log_test("Application Retrieval", False, "No test application ID available")
            return False
            
        response = self.make_request('GET', f'admin/applications/{self.test_application_id}')
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                details = f"Retrieved application for: {data.get('full_name', 'unknown')}"
            except:
                success = False
                details = "Invalid JSON response"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("Application Retrieval", success, details)
        return success

    def test_export_functionality(self):
        """Test CSV export"""
        response = self.make_request('GET', 'admin/export')
        success = response and response.status_code == 200
        
        if success:
            content_type = response.headers.get('content-type', '')
            if 'csv' in content_type.lower() or 'text' in content_type.lower():
                details = f"CSV export successful, size: {len(response.content)} bytes"
            else:
                success = False
                details = f"Unexpected content type: {content_type}"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("CSV Export", success, details)
        return success

    def test_application_deletion(self):
        """Test deleting application"""
        if not self.test_application_id:
            self.log_test("Application Deletion", False, "No test application ID available")
            return False
            
        response = self.make_request('DELETE', f'admin/applications/{self.test_application_id}')
        success = response and response.status_code == 200
        
        if success:
            try:
                data = response.json()
                details = f"Message: {data.get('message', 'Deleted successfully')}"
            except:
                details = "Application deleted (no JSON response)"
        else:
            details = f"Status: {response.status_code if response else 'No response'}"
            
        self.log_test("Application Deletion", success, details)
        return success

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Syria Gaming Lab API Tests")
        print("=" * 50)
        
        # Test sequence
        tests = [
            self.test_api_root,
            self.test_admin_login,
            self.test_application_submission,
            self.test_admin_applications_list,
            self.test_admin_stats,
            self.test_application_status_update,
            self.test_application_retrieval,
            self.test_export_functionality,
            self.test_application_deletion,
        ]
        
        for test in tests:
            try:
                test()
            except Exception as e:
                self.log_test(test.__name__, False, f"Exception: {str(e)}")
            print()  # Add spacing between tests
        
        # Summary
        print("=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed!")
            return 1

def main():
    tester = SyriaGameLabAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())