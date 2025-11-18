package com.eventcraft.EventCraft.service;

import com.eventcraft.EventCraft.dto.VendorRegDTO;
import com.eventcraft.EventCraft.entity.User;
import com.eventcraft.EventCraft.entity.Vendor;
import com.eventcraft.EventCraft.repository.UserRepository;
import com.eventcraft.EventCraft.repository.VendorRepository;
import com.eventcraft.EventCraft.util.TestDataBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for VendorService
 * Tests all business logic for vendor management
 */
@ExtendWith(MockitoExtension.class)
@DisplayName("VendorService Unit Tests")
class VendorServiceTest {

    @Mock
    private VendorRepository vendorRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private VendorService vendorService;

    private User testUser;
    private Vendor testVendor;
    private VendorRegDTO vendorRegDTO;

    @BeforeEach
    void setUp() {
        testUser = TestDataBuilder.buildTestUser();
        testUser.setId("test-user-id");
        testVendor = TestDataBuilder.buildTestVendor(testUser);
        testVendor.setId("test-vendor-id");
        vendorRegDTO = TestDataBuilder.buildVendorRegDTO();
    }

    @Test
    @DisplayName("Should register vendor successfully")
    void testRegisterVendor() {
        when(userRepository.findById("test-user-id")).thenReturn(Optional.of(testUser));
        when(vendorRepository.existsByUser_Id("test-user-id")).thenReturn(false);
        when(vendorRepository.save(any(Vendor.class))).thenReturn(testVendor);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        Vendor result = vendorService.registerVendor("test-user-id", vendorRegDTO);

        assertNotNull(result);
        assertEquals("Test Company", result.getCompanyName());
        assertEquals(User.Role.VENDOR, testUser.getRole());
        verify(userRepository).findById("test-user-id");
        verify(vendorRepository).existsByUser_Id("test-user-id");
        verify(vendorRepository).save(any(Vendor.class));
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw exception when user not found")
    void testRegisterVendorUserNotFound() {
        when(userRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            vendorService.registerVendor("nonexistent", vendorRegDTO);
        });

        verify(userRepository).findById("nonexistent");
        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    @DisplayName("Should throw exception when user already registered as vendor")
    void testRegisterVendorDuplicate() {
        when(userRepository.findById("test-user-id")).thenReturn(Optional.of(testUser));
        when(vendorRepository.existsByUser_Id("test-user-id")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> {
            vendorService.registerVendor("test-user-id", vendorRegDTO);
        });

        verify(vendorRepository).existsByUser_Id("test-user-id");
        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    @DisplayName("Should get all vendors")
    void testGetAllVendors() {
        List<Vendor> vendors = Arrays.asList(testVendor);
        when(vendorRepository.findAll()).thenReturn(vendors);

        List<Vendor> result = vendorService.getAllVendors();

        assertThat(result).hasSize(1);
        verify(vendorRepository).findAll();
    }

    @Test
    @DisplayName("Should get vendor by ID")
    void testGetVendorById() {
        when(vendorRepository.findById("test-vendor-id")).thenReturn(Optional.of(testVendor));
        when(vendorRepository.findById("nonexistent")).thenReturn(Optional.empty());

        Optional<Vendor> found = vendorService.getVendorById("test-vendor-id");
        Optional<Vendor> notFound = vendorService.getVendorById("nonexistent");

        assertTrue(found.isPresent());
        assertEquals("Test Company", found.get().getCompanyName());
        assertFalse(notFound.isPresent());
        verify(vendorRepository, times(2)).findById(anyString());
    }

    @Test
    @DisplayName("Should update vendor successfully")
    void testUpdateVendor() {
        VendorRegDTO updateDTO = TestDataBuilder.buildVendorRegDTO();
        updateDTO.setCompanyName("Updated Company");
        updateDTO.setServiceType("Photography");

        when(vendorRepository.findById("test-vendor-id")).thenReturn(Optional.of(testVendor));
        when(vendorRepository.save(any(Vendor.class))).thenReturn(testVendor);

        Vendor result = vendorService.updateVendor("test-vendor-id", "test-user-id", updateDTO);

        assertNotNull(result);
        verify(vendorRepository).findById("test-vendor-id");
        verify(vendorRepository).save(any(Vendor.class));
    }

    @Test
    @DisplayName("Should throw exception when vendor not found for update")
    void testUpdateVendorNotFound() {
        when(vendorRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> {
            vendorService.updateVendor("nonexistent", "test-user-id", vendorRegDTO);
        });

        verify(vendorRepository).findById("nonexistent");
        verify(vendorRepository, never()).save(any(Vendor.class));
    }

    @Test
    @DisplayName("Should throw exception when user not authorized to update vendor")
    void testUpdateVendorUnauthorized() {
        when(vendorRepository.findById("test-vendor-id")).thenReturn(Optional.of(testVendor));

        assertThrows(RuntimeException.class, () -> {
            vendorService.updateVendor("test-vendor-id", "different-user-id", vendorRegDTO);
        });

        verify(vendorRepository).findById("test-vendor-id");
        verify(vendorRepository, never()).save(any(Vendor.class));
    }
}

